import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Param,
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

  @Get()
  @UseGuards(new AuthGuard())
  showAllDoctors() {
    return this.doctorService.showAll();
  }
  @Get(':id')
  @UseGuards(new AuthGuard())
  showOneDoctor(@Param('id') id: string) {
    return this.doctorService.showOneDoctor(id);
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
