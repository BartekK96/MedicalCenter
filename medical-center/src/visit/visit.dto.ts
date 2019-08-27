import { IsString, IsDate } from 'class-validator';

export class VisitDTO {
  @IsString()
  visitName: string;

  @IsString()
  time: string;

  @IsDate()
  date: string;

  @IsString()
  doctor: string;
}
