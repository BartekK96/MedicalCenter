import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PatientRO } from './patient.ro';

@Entity('patient')
export class PatientEntity {
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
    unique: true,
  })
  login: string;

  @Column('text')
  password: string;
  // Before insert have no will to work! why???
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): PatientRO {
    const { id, created, firstName, lastName, login, token } = this;
    const responseObject = {
      id,
      created,
      firstName,
      lastName,
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
