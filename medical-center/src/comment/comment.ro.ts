import { DataTypeDefaults } from 'typeorm/driver/types/DataTypeDefaults';
import { PatientEntity } from '../patient/patient.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { DoctorRO } from '../doctor/doctor.ro';
import { PatientRO } from '../patient/patient.ro';

export class CommentRO {
  id: string;
  created: Date;
  updated: Date;
  comment: string;
  mark: number;
  patient?: PatientRO;
  doctor?: DoctorRO;
}
