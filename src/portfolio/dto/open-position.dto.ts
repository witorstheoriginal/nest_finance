import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OpenPositionDto {
  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  portfolioId: string;

  @IsString()
  symbol: string;

  @IsString()
  type: string;
}
