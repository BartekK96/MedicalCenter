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
import { DoctorGuard } from '../guards/doctor.guard';

@Controller('visits')
export class VisitController {
  constructor(private visitService: VisitService) {}

  @Get()
  showAllVisits() {
    return this.visitService.showAll();
  }
  @Get(':id')
  showVisit(@Param('id') id: string) {
    return this.visitService.showOne(id);
  }
  @Get('/doctors/:id')
  showAllOneDoctorVisits(@Param('id') id: string) {
    return this.visitService.showOneDoctorVisits(id);
  }

  // @Get('/visitNames')
  // showAllOneTypeVisits(@Param('id') visitName: string) {
  //   return this.visitService.showOneType(visitName);
  // }

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

  @Delete(':id')
  deleteVisit(@Param('id') id: string) {
    return this.visitService.delete(id);
  }
}
