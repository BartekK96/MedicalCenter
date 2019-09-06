import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async showOneDoctorComments(id) {
    return true;
  }
  async addComment(doctorId, patientId, data) {
    return true;
  }
  async updateComment(doctorId, patientId, data) {
    return true;
  }
  async deleteComment(doctorId, patientId) {
    return true;
  }
}
