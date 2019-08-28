import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '../shared/auth.guard';
import { Doctor } from './doctor.decorator';
import { ValidationPipe } from '../shared/validation.pipe';
import { DoctorLoginDTO } from './doctorLogin.dto';
import { DoctorRegisterDTO } from './doctorRegister.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  // available for all
  @Get()
  showAllDoctors() {
    return this.doctorService.showAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: DoctorLoginDTO) {
    return this.doctorService.login(data);
  }

  // only admin can create doctor account
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: DoctorRegisterDTO) {
    return this.doctorService.register(data);
  }
}
