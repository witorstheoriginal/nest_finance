import { IsString } from 'class-validator';

export class UpdateWatchlistDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
