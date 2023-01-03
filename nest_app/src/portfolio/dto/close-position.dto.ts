import { IsString } from 'class-validator';

export class ClosePositionDto {
  @IsString()
  id: string;
}
