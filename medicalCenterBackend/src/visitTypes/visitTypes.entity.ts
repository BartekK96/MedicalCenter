import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { VisitEntity } from '../visit/visit.entity';
import { VisitTypeRO } from './visitTypes.ro';

@Entity()
export class VisitTypesEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'text', unique: true })
  specialization: string;

  @Column('text')
  visitType: string;

  @OneToMany(type => VisitEntity, visit => visit.visitType, { nullable: true })
  visits: VisitEntity[];

  toResponseObject?(): VisitTypeRO {
    const { id, specialization, visitType } = this;
    const responseObject = { id, specialization, visitType };
    return responseObject;
  }
}
