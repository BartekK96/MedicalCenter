import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DoctorRO } from './doctor.ro';
import { VisitEntity } from '../visit/visit.entity';
import { UserRole } from '../shared/roles';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
  })
  firstName: string;

  @Column({
    type: 'text',
  })
  lastName: string;

  @Column({
    type: 'text',
  })
  specialization: string;

  @Column({
    type: 'text',
    unique: true,
  })
  login: string;

  @Column('text')
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DOCTOR,
  })
  role: UserRole;

  @OneToMany(type => VisitEntity, visitObject => visitObject.doctor, {
    cascade: true,
  })
  visits: VisitEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  toResponseObject(showToken: boolean = true): DoctorRO {
    const {
      id,
      created,
      firstName,
      lastName,
      specialization,
      login,
      role,

      token,
    } = this;

    const responseObject: DoctorRO = {
      id,
      created,
      firstName,
      lastName,
      specialization,
      login,
      role,
    };
    if (this.visits) {
      responseObject.visits = this.visits;
    }
    let returnResponseObject;
    if (showToken) {
      returnResponseObject = { ...responseObject, token };
    } else {
      returnResponseObject = { ...responseObject };
    }

    return returnResponseObject;
  }
  async comparePassword(pass: string) {
    return await bcrypt.compare(pass, this.password);
  }

  private get token() {
    const { id, login } = this;
    return jwt.sign(
      {
        id,
        login,
      },
      process.env.SECRET,
      { expiresIn: '12h' },
    );
  }
}
