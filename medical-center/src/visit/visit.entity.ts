import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitRO } from './visit.ro';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { DoctorRO } from '../doctor/doctor.ro';

@Entity()
export class VisitEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  update: Date;

  @Column('date')
  date: Date;

  @Column('time')
  time: string;

  @Column('boolean')
  available: boolean = true;

  @ManyToOne(type => DoctorEntity, doctor => doctor.visits)
  doctor: DoctorRO; // Partial<DoctorEntity>;

  @ManyToOne(type => VisitTypesEntity, type => type.visits)
  visitType: VisitTypesEntity;

  toResponseObject(): VisitRO {
    const {
      id,
      created,
      update,
      date,
      time,
      available,
      visitType,
      doctor,
    } = this;
    const responseObject: any = {
      id,
      created,
      update,
      date,
      time,
      available,
      visitType,
      doctor,
    };
    return responseObject;
  }
}
