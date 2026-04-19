import {
  Controller,
  Post,
  Get,
  Headers,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  createCheckoutSession(
    @Request() req: { user: { sub: string; email: string } },
  ) {
    return this.paymentsService.createCheckoutSession(
      req.user.sub,
      req.user.email,
    );
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Request() req: { user: { sub: string } }) {
    return this.paymentsService.getSubscriptionStatus(req.user.sub);
  }

  @Post('webhook')
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: ExpressRequest & { rawBody: Buffer },
  ) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }
}
