import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { PatientEntity } from '../patient/patient.entity';
import { CommentDTO } from './comment.dto';
import { CommentRO } from './comment.ro';
import { uuidValidator } from '../shared/uuidValidator';

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

  async showOneDoctorComments(id: string): Promise<CommentEntity[]> {
    uuidValidator(id);
    const doctor = await this.doctorRepository.find({
      where: { id },
      join: {
        alias: 'doctor',
        leftJoinAndSelect: {
          comments: 'doctor.comments',
        },
      },
    });

    if (!doctor) {
      throw new HttpException('Doctor does not exist!', HttpStatus.BAD_REQUEST);
    }

    const comments = doctor.map(doc => {
      return doc.comments[0];
    });
    if (comments.length < 1) {
      return [];
    }
    return comments.map(com => {
      return com;
    });
  }
  async addComment(
    doctorId: string,
    patientId: string,
    data: CommentDTO,
  ): Promise<CommentRO> {
    uuidValidator(doctorId);
    uuidValidator(patientId);
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

    if (doctors.length > 0) {
      if (doctors[0].includes(doctorId)) {
        throw new HttpException(
          'You already add comment to this doctor!',
          HttpStatus.BAD_REQUEST,
        );
      }
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
    patientId: string,
    data: Partial<CommentDTO>,
  ): Promise<CommentEntity> {
    uuidValidator(commentId);
    uuidValidator(patientId);
    let comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['patient'],
    });

    if (comment.patient.id !== patientId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.update({ id: commentId }, data);
    comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    return comment;
  }

  async deleteComment(
    commentId: string,
    patientId: string,
  ): Promise<CommentRO> {
    uuidValidator(commentId);
    uuidValidator(patientId);
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['patient'],
    });
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (comment.patient.id !== patientId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.commentRepository.delete({ id: commentId });

    return this.toResponseObject(comment);
  }
  private toResponseObject(comment: CommentEntity): any {
    if (comment.doctor) {
      return {
        ...comment,
        patient: comment.patient.toResponseObject(false),
        doctor: comment.doctor.toResponseObject(false),
      };
    }
    return {
      ...comment,
      patient: comment.patient.toResponseObject(false),
    };
  }
}
