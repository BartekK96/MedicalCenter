import { DoctorRO } from '../doctor/doctor.ro';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { VisitEntity } from './visit.entity';

export class VisitRO {
  id?: string;
  created: Date;
  update: Date;
  date: Date;
  time: string;
  available: boolean;
  visitType: VisitEntity;
  doctor: DoctorRO;
}
