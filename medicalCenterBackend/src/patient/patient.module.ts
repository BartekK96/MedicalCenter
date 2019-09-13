import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientEntity } from './patient.entity';
import { VisitEntity } from '../visit/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, VisitEntity])],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
