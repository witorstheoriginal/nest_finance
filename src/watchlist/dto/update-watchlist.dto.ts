import { IsString } from 'class-validator/types/decorator/decorators';

export class UpdateWatchlistDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
}
