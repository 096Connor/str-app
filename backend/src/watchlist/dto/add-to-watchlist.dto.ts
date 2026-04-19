import { IsString, IsNotEmpty } from 'class-validator';

export class AddToWatchlistDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;
}
