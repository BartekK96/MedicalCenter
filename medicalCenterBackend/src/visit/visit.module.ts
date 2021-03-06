import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './visit.entity';
import { PatientEntity } from '../patient/patient.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitEntity,
      PatientEntity,
      DoctorEntity,
      VisitTypesEntity,
    ]),
  ],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
