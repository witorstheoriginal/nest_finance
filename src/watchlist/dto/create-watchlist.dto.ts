import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateWatchlistDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  symbols: string[];
}
