import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';
import { DoctorEntity } from '../doctor/doctor.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private visitRepostitory: Repository<VisitEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
  ) {}

  async showAll(): Promise<VisitRO[]> {
    const visits = await this.visitRepostitory.find({ relations: ['doctor'] });
    return visits.map(visit => {
      return this.toResponseObject(visit);
    });
  }
  async showOne(id: string): Promise<VisitRO> {
    const visit = await this.visitRepostitory.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(visit);
  }

  async create(doctorId: string, data: VisitDTO): Promise<VisitRO> {
    const doc = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    const visit = await this.visitRepostitory.create({
      ...data,
      doctor: doc,
    });
    await this.visitRepostitory.save(visit);
    return this.toResponseObject(visit);
  }

  //   async showOneDoctor(doctor: string) {
  //     return await this.visitRepostitory.find({
  //       where: { doctor: `${doctor}` },
  //     });
  //   }
  //   async showOneType(name: string) {
  //     return await this.visitRepostitory.find({
  //       where: { visitName: `${name}` },
  //     });
  //   }
  async update(id: string, data: Partial<VisitDTO>): Promise<VisitRO> {
    let visit = await this.visitRepostitory.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.visitRepostitory.update({ id }, data);
    visit = await this.visitRepostitory.findOne({ where: { id } });
    return this.toResponseObject(visit);
  }

  async delete(id: string) {
    const visit = await this.visitRepostitory.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.visitRepostitory.delete({ id });
    return visit;
  }

  private toResponseObject(visit: VisitEntity): VisitRO {
    return { ...visit, doctor: visit.doctor.toResponseObject(false) };
  }
}
