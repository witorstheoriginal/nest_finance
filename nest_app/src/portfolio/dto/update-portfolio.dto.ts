import { IsString } from 'class-validator';

export class UpdatePortfolioDto {
  @IsString()
  name: string;
}
