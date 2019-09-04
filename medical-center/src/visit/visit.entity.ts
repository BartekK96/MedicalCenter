import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitRO } from './visit.ro';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { DoctorRO } from '../doctor/doctor.ro';
import { Patient } from '../patient/patient.decorator';
import { PatientRO } from '../patient/patient.ro';
import { PatientEntity } from '../patient/patient.entity';

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
  doctor: DoctorEntity; // DoctorRO; // Partial<DoctorEntity>;

  @ManyToOne(type => VisitTypesEntity, type => type.visits)
  visitType: VisitTypesEntity;

  @OneToOne(type => PatientEntity)
  @JoinColumn()
  patient: PatientEntity;

  toResponseObject?(): VisitRO {
    const {
      id,
      created,
      update,
      date,
      time,
      available,
      patient,
      visitType,
      doctor,
    } = this;
    const responseObject: VisitRO = {
      id,
      created,
      update,
      date,
      time,
      available,
      visitType,
      doctor,
      patient,
    };
    return responseObject;
  }
}
