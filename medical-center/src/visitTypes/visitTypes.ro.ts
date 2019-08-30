import { VisitEntity } from '../visit/visit.entity';

export class VisitTypeRO {
  id?: string;
  specialization: string;
  visitType: string;
  visits?: VisitEntity[];
}
