import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';

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

  @Column('text')
  visitName: string;

  @Column('boolean')
  available: boolean = true;

  @ManyToOne(type => DoctorEntity, doctor => doctor.visits)
  doctor: DoctorEntity;
}
