import { VisitEntity } from '../visit/visit.entity';

export class DoctorRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  specialization: string;
  login?: string;
  role: string;
  visits?: VisitEntity[];
  token?: string;
}
