import { DataTypeDefaults } from 'typeorm/driver/types/DataTypeDefaults';
import { PatientEntity } from '../patient/patient.entity';
import { DoctorEntity } from '../doctor/doctor.entity';

export class CommentRO {
  id: string;
  created: Date;
  updated: Date;
  comment: string;
  mark: number;
  patient: PatientEntity;
  doctor: DoctorEntity;
}
