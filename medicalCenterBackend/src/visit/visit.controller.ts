import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { VisitService } from './visit.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { Doctor } from '../doctor/doctor.decorator';
import { DoctorGuard } from '../shared/doctor.guard';
import { VisitEntity } from './visit.entity';
import { Patient } from '../patient/patient.decorator';
import { PatientGuard } from '../shared/patient.guard ';

@Controller('visits')
@UseGuards(new AuthGuard())
export class VisitController {
  constructor(private visitService: VisitService) {}

  @Get('/visit/:id')
  showVisit(@Param('id') id: string) {
    return this.visitService.showOne(id);
  }

  @Get('types')
  showAllVisitsType() {
    return this.visitService.showAllTypes();
  }

  @Get('/types/:id')
  showOneTypeAllVisits(@Param('id') id: string) {
    return this.visitService.showOneType(id);
  }
  @Get('/doctor/:id')
  showAllOneDoctorVisits(@Param('id') id: string) {
    return this.visitService.showOneDoctorVisits(id);
  }

  @Post()
  @UseGuards(new AuthGuard(), DoctorGuard)
  @UsePipes(new ValidationPipe())
  createVisit(@Doctor('id') doctor, @Body() data: VisitEntity) {
    return this.visitService.create(doctor, data);
  }

  @Post('/reserve/:id')
  @UseGuards(new AuthGuard(), PatientGuard)
  @UsePipes(new ValidationPipe())
  reserveVisit(@Patient('id') patient: string, @Param('id') id: string) {
    return this.visitService.reserveVisit(patient, id);
  }
  @Post('/undo/:id')
  @UseGuards(new AuthGuard(), PatientGuard)
  @UsePipes(new ValidationPipe())
  UndoVisit(@Patient('id') patient: string, @Param('id') id: string) {
    return this.visitService.undoVisit(patient, id);
  }
  // only admins can delete visits
}
