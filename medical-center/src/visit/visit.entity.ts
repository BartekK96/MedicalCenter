import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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
}
