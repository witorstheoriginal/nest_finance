import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  symbol: string;

  @IsString()
  date: string;

  @IsString()
  status: string;

  @IsString()
  type: string;
}
