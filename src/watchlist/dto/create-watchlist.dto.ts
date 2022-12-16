import { IsNumberString } from 'class-validator';
import { IsArray, IsString } from 'class-validator/types/decorator/decorators';

export class CreateWatchlistDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
  @IsArray()
  symbols: string[];
}

export class FindOneParams {
  @IsNumberString()
  id: number;
}
