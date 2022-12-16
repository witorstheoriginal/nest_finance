import { IsArray } from 'class-validator/types/decorator/decorators';

export class UpdateSymbolsDto {
  @IsArray()
  readonly add: string[];
  @IsArray()
  readonly remove: string[];
}
