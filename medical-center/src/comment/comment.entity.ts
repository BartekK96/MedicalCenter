import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PatientEntity } from '../patient/patient.entity';
import { DoctorEntity } from '../doctor/doctor.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  update: Date;

  @Column('text')
  comment: string;

  @ManyToOne(type => PatientEntity, patient => patient.comments)
  patient: PatientEntity;

  @OneToOne(type => DoctorEntity)
  @JoinColumn()
  doctor: DoctorEntity;
}
