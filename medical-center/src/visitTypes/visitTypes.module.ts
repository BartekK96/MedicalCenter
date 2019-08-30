import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from '../visit/visit.entity';
import { VisitTypesEntity } from './visitTypes.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesController } from './visitTypes.controller';
import { VisitTypesService } from './visitTypes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitTypesEntity, VisitEntity, DoctorEntity]),
  ],
  controllers: [VisitTypesController],
  providers: [VisitTypesService],
})
export class VisitTypesModule {}
