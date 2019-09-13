import { VisitEntity } from '../visit/visit.entity';
import { UserRole } from '../shared/roles.users';
import { CommentEntity } from '../comment/comment.entity';

export class DoctorRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  specialization: string;
  comments?: CommentEntity[];
  login?: string;
  role: UserRole;
  visits?: VisitEntity[];
  token?: string;
  // uncomment in production mode
 // confirmed?: number;
}
