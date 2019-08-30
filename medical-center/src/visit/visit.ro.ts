import { DoctorRO } from '../doctor/doctor.ro';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';

export class VisitRO {
  id?: string;
  created: Date;
  update: Date;
  date: Date;
  time: string;
  available: boolean;
  visitType: string;
  doctor: DoctorRO;
}
