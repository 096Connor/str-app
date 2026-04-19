import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getHistory(userId: string) {
    return this.prisma.watchHistory.findMany({
      where: { userId, completed: false },
      include: { movie: true },
      orderBy: { watchedAt: 'desc' },
      take: 20,
      distinct: ['movieId'],
    });
  }

  async getCompleted(userId: string) {
    return this.prisma.watchHistory.findMany({
      where: { userId, completed: true },
      include: { movie: true },
      orderBy: { watchedAt: 'desc' },
      distinct: ['movieId'],
    });
  }

  async addToHistory(userId: string, movieId: string) {
    const existing = await this.prisma.watchHistory.findFirst({
      where: { userId, movieId },
    });

    if (existing?.completed) return existing;

    await this.prisma.watchHistory.deleteMany({
      where: { userId, movieId, completed: false },
    });

    return this.prisma.watchHistory.create({
      data: { userId, movieId },
      include: { movie: true },
    });
  }

  async markCompleted(userId: string, movieId: string) {
    await this.prisma.watchHistory.updateMany({
      where: { userId, movieId },
      data: { completed: true },
    });
  }

  async clearHistory(userId: string) {
    return this.prisma.watchHistory.deleteMany({
      where: { userId },
    });
  }
}
