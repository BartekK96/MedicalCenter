import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '../shared/auth.guard';
import { Doctor } from './doctor.decorator';
import { ValidationPipe } from '../shared/validation.pipe';
import { DoctorLoginDTO } from './doctorLogin.dto';
import { DoctorRegisterDTO } from './doctorRegister.dto';
import { CommentService } from '../comment/comment.service';
import { Patient } from '../patient/patient.decorator';
import { CommentEntity } from '../comment/comment.entity';
import { CommentDTO } from '../comment/comment.dto';
import { PatientGuard } from '../shared/patient.guard ';

@Controller('doctors')
export class DoctorController {
  constructor(
    private doctorService: DoctorService,
    private commentService: CommentService,
  ) {}

  // it should be change to doctors specialization in future
  @Get()
  @UseGuards(new AuthGuard())
  showAllDoctors() {
    return this.doctorService.showAll();
  }

  @Get('/doctor/:id')
  @UseGuards(new AuthGuard())
  showOneDoctor(@Param('id') id: string) {
    return this.doctorService.showOneDoctor(id);
  }

  @Get('/doctor/comments/:id')
  @UseGuards(new AuthGuard())
  showOneDoctorComment(@Param('id') id: string) {
    return this.commentService.showOneDoctorComments(id);
  }

  @Post('/doctor/:id')
  @UseGuards(new AuthGuard(), PatientGuard)
  @UsePipes(new ValidationPipe())
  addComment(
    @Param('id') doctorId: string,
    @Patient('id') patientId: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.addComment(doctorId, patientId, data);
  }

  @Put('/doctor/:id')
  @UseGuards(new AuthGuard(), PatientGuard)
  @UsePipes(new ValidationPipe())
  updateComment(
    @Param('id') commentId: string,
    @Patient('id') patientId: string,
    @Body() data: Partial<CommentDTO>,
  ) {
    return this.commentService.updateComment(commentId, patientId, data);
  }

  @Delete('/doctor/:id')
  @UseGuards(new AuthGuard(), PatientGuard)
  deleteComment(
    @Param('id') commentId: string,
    @Patient('id') patientId: string,
  ) {
    return this.commentService.deleteComment(commentId, patientId);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: DoctorLoginDTO) {
    return this.doctorService.login(data);
  }

  // before using doctor account admin must confirm each doctor
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: DoctorRegisterDTO) {
    return this.doctorService.register(data);
  }
}
