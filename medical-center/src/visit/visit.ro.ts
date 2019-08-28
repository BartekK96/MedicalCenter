import { DoctorRO } from '../doctor/doctor.ro';

export class VisitRO {
  id?: string;
  created: Date;
  date: Date;
  time: string;
  visitName: string;
  available: boolean;
  doctor: DoctorRO;
}
