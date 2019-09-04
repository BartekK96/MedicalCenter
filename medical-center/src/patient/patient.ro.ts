import { VisitEntity } from '../visit/visit.entity';
import { UserRole } from '../shared/roles.users';

export class PatientRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  login?: string;
  role: UserRole;
  visits?: VisitEntity[];
  token?: string;
}
