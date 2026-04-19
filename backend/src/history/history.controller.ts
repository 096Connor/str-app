import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { AddHistoryDto } from './dto/add-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  getHistory(@Request() req: { user: { sub: string } }) {
    return this.historyService.getHistory(req.user.sub);
  }

  @Get('completed')
  getCompleted(@Request() req: { user: { sub: string } }) {
    return this.historyService.getCompleted(req.user.sub);
  }

  @Post()
  addToHistory(
    @Request() req: { user: { sub: string } },
    @Body() dto: AddHistoryDto,
  ) {
    return this.historyService.addToHistory(req.user.sub, dto.movieId);
  }

  @Patch(':movieId/complete')
  markCompleted(
    @Request() req: { user: { sub: string } },
    @Param('movieId') movieId: string,
  ) {
    return this.historyService.markCompleted(req.user.sub, movieId);
  }

  @Delete()
  clearHistory(@Request() req: { user: { sub: string } }) {
    return this.historyService.clearHistory(req.user.sub);
  }
}
