import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  name: string;
}
