import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DoctorEntity } from 'src/doctor/doctor.entity';

@Entity()
export class VisitEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn()
  created: Date;

  @Column('date')
  date: string;

  @Column('time')
  time: string;

  @Column('text')
  visitName: string;

  @Column('text')
  doctor: string;

  @Column('boolean')
  available: boolean = true;

  @ManyToOne(type => DoctorEntity, doctor => doctor.visits)
  doctor: DoctorEntity;
}
