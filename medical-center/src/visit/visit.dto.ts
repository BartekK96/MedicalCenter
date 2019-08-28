import { IsString, IsDate, IsArray } from 'class-validator';
import { DoctorEntity } from '../doctor/doctor.entity';

export class VisitDTO {
  @IsString()
  visitName: string;

  @IsString()
  time: string;

  // @IsDate()
  // date: string;

  // array of doctors
}
