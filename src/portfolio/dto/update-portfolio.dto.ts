import { IsString } from 'class-validator';

export class updatePortfolioDto {
  @IsString()
  name: string;
}
