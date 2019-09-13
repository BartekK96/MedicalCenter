import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientRegisterDTO } from './patientRegister.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { PatientLoginDTO } from './patientLogin.dto';
import { AuthGuard } from '../shared/auth.guard';
import { Patient } from './patient.decorator';
import { DoctorGuard } from '../shared/doctor.guard';

@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get()
  @UseGuards(new AuthGuard(), DoctorGuard)
  showAllPatients() {
    return this.patientService.showAll();
  }

  @Get(':id')
  @UseGuards(new AuthGuard(), DoctorGuard)
  showOnePateint(@Param('id') id: string) {
    return this.patientService.showOne(id);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: PatientLoginDTO) {
    return this.patientService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: PatientRegisterDTO) {
    return this.patientService.register(data);
  }
}
