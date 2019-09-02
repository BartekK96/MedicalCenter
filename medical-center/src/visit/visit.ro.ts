import { DoctorRO } from '../doctor/doctor.ro';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { VisitEntity } from './visit.entity';
import { PatientRO } from '../patient/patient.ro';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { PatientEntity } from 'src/patient/patient.entity';

export class VisitRO {
  id?: string;
  created: Date;
  update: Date;
  date: Date;
  time: string;
  available: boolean;
  visitType: VisitTypesEntity;
  doctor: DoctorRO;
  patient?: PatientEntity;
}
