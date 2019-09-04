import { VisitEntity } from '../visit/visit.entity';
import { UserRole } from '../shared/roles.users';

export class DoctorRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  specialization: string;
  login?: string;
  role: UserRole;
  visits?: VisitEntity[];
  token?: string;
}
