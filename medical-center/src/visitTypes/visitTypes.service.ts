import { Injectable } from '@nestjs/common';
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
    const types = await this.visitTypeRepository.find({ relations: ['visit'] });
    return types.map(type => {
      return this.toResponseObject(type);
    });
  }
  async showOne(): Promise<VisitTypeRO[]> {
    const types = await this.visitTypeRepository.find({ relations: ['visit'] });
    return types.map(type => {
      return this.toResponseObject(type);
    });
  }
  async createOne(data): Promise<VisitTypeRO[]> {
    const types = await this.visitTypeRepository.find({ relations: ['visit'] });
    return types.map(type => {
      return this.toResponseObject(type);
    });
  }
  private toResponseObject(types: VisitTypesEntity): VisitTypeRO {
    return { ...types, visits: types.visits };
  }
}

// updateOne

// deleteOne
