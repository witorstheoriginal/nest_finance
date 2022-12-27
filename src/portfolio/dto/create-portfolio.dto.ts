import { IsArray, IsString } from 'class-validator';
import { Position } from '../schemas/position.schema';

export class CreatePortfolioDto {
  @IsString()
  name: string;
}
