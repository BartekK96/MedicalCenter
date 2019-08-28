import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DoctorRO } from './doctor.ro';

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
      token,
    } = this;
    const responseObject = {
      id,
      created,
      firstName,
      lastName,
      specialization,
      login,
      token,
    };
    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
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
