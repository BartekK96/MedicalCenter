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

@Controller('doctors')
export class DoctorController {
  constructor(
    private doctorService: DoctorService,
    private commentService: CommentService,
  ) {}

  // it should be change to doctors specialization
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

  @Get('/doctor/:id/comment')
  @UseGuards(new AuthGuard())
  showOneDoctorComment(@Param('id') id: string) {
    return this.commentService.showOneDoctorComments(id);
  }

  // only patient can add, upgrade or delete a comment
  @Post('/doctor/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  addComment(
    @Param('id') doctorId: string,
    @Patient('id') patientId: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.addComment(doctorId, patientId, data);
  }

  @Put('/doctor/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateComment(
    @Param('id') commentId: string,
    @Body() data: Partial<CommentDTO>,
  ) {
    return this.commentService.updateComment(commentId, data);
  }

  @Delete('/doctor/:id')
  @UseGuards(new AuthGuard())
  deleteComment(@Param('id') commentId: string) {
    return this.commentService.deleteComment(commentId);
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
