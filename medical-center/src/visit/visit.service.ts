import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitRole } from '../shared/roles.visits';

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

  async showOneDoctorVisits(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['visits'],
    });
    return doctor.visits;
  }

  async showAllTypes(): Promise<any> {
    return VisitRole;
  }
  // to do
  // async showOneType(name: string) {
  //   console.log(VisitTypes);
  //   const visits = await this.visitRepostitory.find({
  //     where: { visitName: `${name}` },
  //   });
  //   console.log(visits);
  //   return visits;
  // }

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
    return {
      ...visit,
      doctor: visit.doctor.toResponseObject(false),
      visitType: visit.visitType,
    };
  }

  async create(doctorId: string, data: VisitDTO): Promise<VisitRO> {
    const doc = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    // checking type of visit
    // if (!(await this.checkingTypeOfVisit(data.visitName))) {
    //   throw new HttpException(
    //     'This kind of visit does not exist!',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const visit = await this.visitRepostitory.create({
      ...data,
      doctor: doc,
    });
    await this.visitRepostitory.save(visit);
    return this.toResponseObject(visit);
  }
  private async checkingTypeOfVisit(visitName: string): Promise<boolean> {
    if (!Object.values(VisitRole).indexOf(`${visitName}`)) {
      return true;
    }
    return false;
  }
}
