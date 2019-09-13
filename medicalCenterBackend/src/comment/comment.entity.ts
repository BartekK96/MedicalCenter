import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { PatientEntity } from '../patient/patient.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PatientRO } from '../patient/patient.ro';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  comment: string;

  @Column('int')
  mark: number;

  @ManyToOne(type => PatientEntity, patient => patient.comments)
  patient: PatientEntity;

  @ManyToOne(type => DoctorEntity)
  doctor: DoctorEntity;
}
