import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitModule } from './visit/visit.module';
import { PatientService } from './patient/patient.service';
import { PatientController } from './patient/patient.controller';
import { PatientModule } from './patient/patient.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { DoctorModule } from './doctor/doctor.module';
import { VisitTypesModule } from './visitTypes/visitTypes.module';

// import 'reflect-metadata';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    VisitModule,
    PatientModule,
    DoctorModule,
    VisitTypesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
