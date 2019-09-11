import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PatientRO } from './patient.ro';
import { UserRole } from '../shared/roles.users';
import { VisitEntity } from '../visit/visit.entity';
import { CommentEntity } from '../comment/comment.entity';

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @OneToMany(type => VisitEntity, visitObject => visitObject.patient, {
    cascade: true,
  })
  visits: VisitEntity[];

  @OneToMany(type => CommentEntity, comment => comment.patient, {
    cascade: true,
  })
 // @JoinColumn()
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): PatientRO {
    const { id, created, firstName, lastName, role, token, visits } = this;
    let responseObject: PatientRO = {
      id,
      created,
      firstName,
      lastName,
      role,
    };

    if (showToken) {
      responseObject = { ...responseObject, token };
    }
    if (this.visits) {
      responseObject.visits = this.visits;
    }

    return responseObject;
  }
  async comparePassword(pass: string) {
    return await bcrypt.compare(pass, this.password);
  }

  private get token() {
    const { id, login, role } = this;
    return jwt.sign(
      {
        id,
        login,
        role,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
