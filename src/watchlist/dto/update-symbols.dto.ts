import { IsArray } from 'class-validator/types/decorator/decorators';

export class UpdateSymbolsDto {
  @IsArray()
  add: string[];

  @IsArray()
  remove: string[];
}
