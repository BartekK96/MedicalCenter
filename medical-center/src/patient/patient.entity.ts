import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { VisitEntity } from '../visit/visit.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity()
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

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  toResponseObject(showToken: boolean = true) {
    const { id, created, firstName, lastName, login, token } = this;
    const responseObject = { id, created, firstName, lastName, login, token };
    if (showToken) {
      responseObject.token = token;
    }
    return responseObject;
  }
  async comparePassword(pass: string) {
    return await bcrypt.compare(pass, this.password);
  }

  private token() {
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
