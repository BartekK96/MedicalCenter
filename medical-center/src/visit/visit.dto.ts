import { IsString, IsDate, IsArray } from 'class-validator';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitRO } from './visit.ro';

export class VisitDTO {
  // @IsString()
  // visitType: string;

  @IsString()
  time: string;

  // @IsDate()
  // date: string;

  // array of doctors
}
