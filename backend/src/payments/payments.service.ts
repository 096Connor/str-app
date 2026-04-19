import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
    );
  }

  async createCheckoutSession(userId: string, userEmail: string) {
    const priceId = this.configService.get<string>('STRIPE_PRICE_ID')!;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    let stripeCustomerId = user?.stripeCustomerId;

    if (!stripeCustomerId) {
      const stripeCustomer = await this.stripe.customers.create({
        email: userEmail,
      });
      stripeCustomerId = stripeCustomer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `http://localhost:3000/dashboard?subscribed=true`,
      cancel_url: `http://localhost:3000/dashboard?canceled=true`,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    )!;
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch {
      throw new Error('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerId = session.customer as string;

      await this.prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          isSubscribed: true,
          subscribedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await this.prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isSubscribed: false, subscribedUntil: null },
      });
    }

    return { received: true };
  }

  async getSubscriptionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return {
      isSubscribed: user?.isSubscribed || false,
      subscribedUntil: user?.subscribedUntil || null,
    };
  }
}
