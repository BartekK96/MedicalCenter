import { IsString } from 'class-validator';

export class VisitTypeDTO {
  @IsString()
  specialization: string;

  @IsString()
  visitType: string;
}
