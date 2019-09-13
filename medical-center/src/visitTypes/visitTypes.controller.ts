import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { VisitTypesService } from './visitTypes.service';
import { VisitTypeDTO } from './visitTypes.dto';
import { AuthGuard } from '../shared/auth.guard';
import { DoctorGuard } from '../shared/doctor.guard';

@Controller('visit_types')
export class VisitTypesController {
  constructor(private VisitTypeService: VisitTypesService) {}

  @Get()
  @UseGuards(new AuthGuard())
  showAllTypes() {
    return this.VisitTypeService.showAll();
  }
  @Get(':id')
  @UseGuards(new AuthGuard())
  showOneType(@Param('id') id: string) {
    return this.VisitTypeService.showOne(id);
  }

  @Post()
  @UseGuards(new AuthGuard(), DoctorGuard)
  @UsePipes(new ValidationPipe())
  createVisitType(@Body() data: VisitTypeDTO) {
    return this.VisitTypeService.createOne(data);
  }
}
