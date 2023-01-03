import { IsArray } from 'class-validator';

export class UpdateSymbolsDto {
  @IsArray()
  add: string[];

  @IsArray()
  remove: string[];
}
