import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { VisitTypesEntity } from './visitTypes.entity';
import { Repository } from 'typeorm';
import { VisitEntity } from '../visit/visit.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitTypeRO } from './visitTypes.ro';

@Injectable()
export class VisitTypesService {
  constructor(
    @InjectRepository(VisitEntity)
    private visitRepostitory: Repository<VisitEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(VisitTypesEntity)
    private visitTypeRepository: Repository<VisitTypesEntity>,
  ) {}

  async showAll(): Promise<VisitTypeRO[]> {
    const types = await this.visitTypeRepository.find();
    return types.map(type => {
      return this.toResponseObject(type);
    });
  }
  async showOne(id: string): Promise<VisitTypeRO> {
    const type = await this.visitTypeRepository.findOne({
      where: { id },
      relations: ['visit'],
    });
    if (!type) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(type);
  }
  // Only admin can create new one, update or delete
  async createOne(data): Promise<VisitTypeRO> {
    const type = await this.visitTypeRepository.create({
      ...data,
    });
    await this.visitTypeRepository.save(type);
    return data;
  }

  // updateOne

  // deleteOne

  private toResponseObject(types: VisitTypesEntity): VisitTypeRO {
    return { ...types, visits: types.visits };
  }
}
