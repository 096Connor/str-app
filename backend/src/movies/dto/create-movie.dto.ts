import { IsString, IsInt, IsArray, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear: number;

  @IsInt()
  @Min(1)
  duration: number; // w minutach

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsString()
  thumbnail: string; // URL do plakatu

  @IsString()
  videoUrl: string; // URL do wideo

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
