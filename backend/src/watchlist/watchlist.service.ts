import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async getWatchlist(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addToWatchlist(userId: string, dto: AddToWatchlistDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const existing = await this.prisma.watchlist.findUnique({
      where: { userId_movieId: { userId, movieId: dto.movieId } },
    });
    if (existing) throw new ConflictException('Movie already in watchlist');

    return this.prisma.watchlist.create({
      data: { userId, movieId: dto.movieId },
      include: { movie: true },
    });
  }

  async removeFromWatchlist(userId: string, movieId: string) {
    const item = await this.prisma.watchlist.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
    if (!item) throw new NotFoundException('Movie not in watchlist');

    return this.prisma.watchlist.delete({
      where: { userId_movieId: { userId, movieId } },
    });
  }

  async isInWatchlist(userId: string, movieId: string): Promise<boolean> {
    const item = await this.prisma.watchlist.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
    return !!item;
  }
}
