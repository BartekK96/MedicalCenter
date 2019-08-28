import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientRegisterDTO } from './patientRegister.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { PatientLoginDTO } from './patientLogin.dto';
import { AuthGuard } from '../shared/auth.guard';
import { Patient } from './patient.decorator';

@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  // Guards for doctors
  @Get()
  @UseGuards(new AuthGuard())
  showAllPatients() {
    return this.patientService.showAll();
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
