import { IsNumber, IsString } from 'class-validator';

export class OpenPositionDto {
  @IsNumber()
  quantity: number;

  @IsString()
  symbol: string;

  @IsString()
  type: string;
}
