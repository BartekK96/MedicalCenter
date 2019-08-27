import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientDTO } from './patient.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get()
  showAllPatients() {
    return this.patientService.showAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: PatientDTO) {
    return this.patientService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: PatientDTO) {
    return this.patientService.register(data);
  }
}
