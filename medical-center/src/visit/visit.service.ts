import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private visitRepostitory: Repository<VisitEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(VisitTypesEntity)
    private visitTypeRepository: Repository<VisitTypesEntity>,
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

  async showAllTypes(): Promise<VisitTypeRO[]> {
    const types = await this.visitTypeRepository.find();
    return types.map(type => {
      return type.toResponseObject();
    });
  }

  async showOneType(id: string): Promise<VisitRO[]> {
    const type = await this.visitTypeRepository.findOne({ where: { id } });

    const visits = await this.visitRepostitory.find({
      where: { visitType: type },
    });
    if (visits) {
      return visits.map(visit => {
        return this.toResponseObject(visit);
      });
    }
    return [];
  }

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

    const types = await this.visitTypeRepository.find();

    const type = types.filter(typ => {
      if (typ.visitType === data.visitType) {
        return typ.visitType;
      }
      return false;
    });
    if (type.length < 1) {
      throw new HttpException(
        'This kind of visit does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    ///
    const obj = {
      ...data,
      doctor: doc.toResponseObject(),
    };
    console.log(obj);
    ///
    const visit = await this.visitRepostitory.create({
      ...data,
      doctor: doc,
    });
    await this.visitRepostitory.save(visit);
    return this.toResponseObject(visit);
  }
}
