import { IsString } from 'class-validator/types/decorator/decorators';

export class UpdateWatchlistDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
