import { IsArray, IsString } from 'class-validator/types/decorator/decorators';

export class CreateWatchlistDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  symbols: string[];
}
