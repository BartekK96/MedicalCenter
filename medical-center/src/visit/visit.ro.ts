import { DoctorRO } from '../doctor/doctor.ro';

export class VisitRO {
  id?: string;
  created: Date;
  update: Date;
  date: Date;
  time: string;
  available: boolean;
  visitType: VisitRO;
  doctor: DoctorRO;
}
