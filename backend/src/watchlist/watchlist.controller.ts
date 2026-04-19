import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  getWatchlist(@Request() req: { user: { sub: string; email: string } }) {
    return this.watchlistService.getWatchlist(req.user.sub);
  }

  @Post()
  addToWatchlist(
    @Request() req: { user: { sub: string; email: string } },
    @Body() dto: AddToWatchlistDto,
  ) {
    return this.watchlistService.addToWatchlist(req.user.sub, dto);
  }

  @Delete(':movieId')
  removeFromWatchlist(
    @Request() req: { user: { sub: string; email: string } },
    @Param('movieId') movieId: string,
  ) {
    return this.watchlistService.removeFromWatchlist(req.user.sub, movieId);
  }

  @Get(':movieId/check')
  checkWatchlist(
    @Request() req: { user: { sub: string; email: string } },
    @Param('movieId') movieId: string,
  ) {
    return this.watchlistService.isInWatchlist(req.user.sub, movieId);
  }
}
