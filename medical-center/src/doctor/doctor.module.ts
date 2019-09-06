import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { PatientEntity } from '../patient/patient.entity';
import { VisitEntity } from '../visit/visit.entity';
import { CommentEntity } from '../comment/comment.entity';
import { CommentService } from '../comment/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorEntity,
      PatientEntity,
      VisitEntity,
      CommentEntity,
    ]),
  ],
  providers: [DoctorService, CommentService],
  controllers: [DoctorController],
})
export class DoctorModule {}
