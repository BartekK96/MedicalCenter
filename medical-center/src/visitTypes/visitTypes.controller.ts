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

@Controller('visit_types')
export class VisitTypesController {
  constructor(private VisitTypeService: VisitTypesService) {}

  @Get()
  showAllTypes() {
    return this.VisitTypeService.showAll();
  }
  @Get(':id')
  showOneType(@Param('id') id: string) {
    return this.VisitTypeService.showOne(id);
  }
  @Post()
  @UsePipes(new ValidationPipe())
  createVisitType(@Body() data: VisitTypeDTO) {
    return this.VisitTypeService.createOne(data);
  }
}
