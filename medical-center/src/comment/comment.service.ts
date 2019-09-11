import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { PatientEntity } from '../patient/patient.entity';
import { CommentDTO } from './comment.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}
  private toResponseObject(comment: CommentEntity) {
    return {
      ...comment,
      patient: comment.patient, // && comment.patient.toResponseObject(),
      doctor: comment.doctor, // && comment.doctor.toResponseObject(),
    };
  }

  async showOneDoctorComments(id: string): Promise<CommentEntity[]> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    const comments = doctor.comments;
    if (!comments) {
      return [];
    }
    return comments.map(comment => {
      return this.toResponseObject(comment);
    });
  }
  async addComment(
    doctorId: string,
    patientId: string,
    data: CommentDTO,
  ): Promise<CommentEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException('Doctor does not exist!', HttpStatus.BAD_REQUEST);
    }

    const patient = await this.patientRepository.find({
      where: { id: patientId },
      join: {
        alias: 'patient',
        leftJoinAndSelect: {
          comments: 'patient.comments',
          doctor: 'comments.doctor',
        },
      },
    });

    if (!patient) {
      throw new HttpException(
        'Patient does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    // check if comment is already added to doctor
    const doctors = patient.map(pat => {
      return pat.comments.map(com => {
        return com.doctor.id;
      });
    });

    if (doctors[0].includes(doctorId)) {
      throw new HttpException(
        'You already add comment to this doctor!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const responsePatient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    const comment = await this.commentRepository.create({
      ...data,
      patient: responsePatient.toResponseObject(false),
      doctor: doctor.toResponseObject(false),
    });
    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async updateComment(
    commentId: string,
    data: Partial<CommentDTO>,
  ): Promise<CommentEntity> {
    let comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.update({ id: commentId }, data);
    comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    return this.toResponseObject(comment);
  }
  async deleteComment(commentId: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.delete({ id: commentId });
    return this.toResponseObject(comment);
  }
}
