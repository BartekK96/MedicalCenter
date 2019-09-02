import { VisitEntity } from '../visit/visit.entity';

export class PatientRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  login?: string;
  role: string;
  visits?: VisitEntity[];
  token?: string;
}
