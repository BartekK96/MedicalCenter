import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitDTO } from './visit.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { Doctor } from '../doctor/doctor.decorator';
import { DoctorGuard } from '../shared/doctor.guard';

@Controller('visits')
@UseGuards(new AuthGuard())
export class VisitController {
  constructor(private visitService: VisitService) {}

  // it should show only available vists in future
  @Get()
  showAllVisitsType() {
    return this.visitService.showAllTypes();
  }
  @Get(':id')
  showVisit(@Param('id') id: string) {
    return this.visitService.showOne(id);
  }
  // it should show only available vists in future
  @Get('/types/:id')
  showOneTypeAllVisits(@Param('id') id: string) {
    return this.visitService.showOneType(id);
  }
  @Get('/doctors/:id')
  showAllOneDoctorVisits(@Param('id') id: string) {
    return this.visitService.showOneDoctorVisits(id);
  }

  // Only doctor can add visit
  @Post()
  @UseGuards(new AuthGuard(), DoctorGuard)
  @UsePipes(new ValidationPipe())
  createVisit(@Doctor('id') doctor, @Body() data: VisitDTO) {
    return this.visitService.create(doctor, data);
  }

  // Only patient can cancel visit(only 24h before visit)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateVisit(@Param('id') id: string, @Body() data: Partial<VisitDTO>) {
    return this.visitService.update(id, data);
  }
  // Only doctor can delete visit
  @Delete(':id')
  deleteVisit(@Param('id') id: string) {
    return this.visitService.delete(id);
  }
}
