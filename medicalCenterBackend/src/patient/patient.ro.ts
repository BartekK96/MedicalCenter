import { VisitEntity } from '../visit/visit.entity';
import { UserRole } from '../shared/roles.users';
import { CommentEntity } from '../comment/comment.entity';

export class PatientRO {
  id: string;
  created: Date;
  firstName: string;
  lastName: string;
  comments?: CommentEntity[];
  login?: string;
  role: UserRole;
  visits?: VisitEntity[];
  token?: string;
}
