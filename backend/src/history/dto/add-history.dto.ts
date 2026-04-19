import { IsString, IsNotEmpty } from 'class-validator';

export class AddHistoryDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;
}
