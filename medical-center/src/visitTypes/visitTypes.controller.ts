import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VisitTypesService } from './visitTypes.service';
import { VisitTypeDTO } from './visitTypes.dto';

@Controller('visit-types')
export class VisitTypesController {
  constructor(private VisitTypeService: VisitTypesService) {}

  @Get()
  showAllTypes() {
    return this.VisitTypeService.showAll();
  }
  @Get(':id')
  showOneType(@Param('id') id: string) {
    return this.VisitTypeService.showOne();
  }
  @Post()
  @UsePipes(new ValidationPipe())
  createVisitType(@Body() data: VisitTypeDTO) {
    return this.VisitTypeService.createOne(data);
  }
}
