import { IsArray } from 'class-validator';
import { Position } from '../schemas/position.schema';

export class UpdatePositionsDto {
  @IsArray()
  add: Position[]; //string[] ?

  @IsArray()
  positioremovens: Position[]; //string[] ?
}
