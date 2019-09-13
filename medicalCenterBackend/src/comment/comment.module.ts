import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PatientEntity } from '../patient/patient.entity';
import { VisitEntity } from '../visit/visit.entity';
import { CommentEntity } from './comment.entity';
import { DoctorService } from '../doctor/doctor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorEntity,
      PatientEntity,
      VisitEntity,
      CommentEntity,
    ]),
  ],
  providers: [CommentService, DoctorService],
  controllers: [CommentController],
})
export class CommentModule {}
