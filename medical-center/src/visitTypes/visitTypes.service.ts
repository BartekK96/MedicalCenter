import {
  Injectable,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { VisitTypesEntity } from './visitTypes.entity';
import { Repository } from 'typeorm';
import { VisitEntity } from '../visit/visit.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitTypeRO } from './visitTypes.ro';
import { AuthGuard } from '../shared/auth.guard';
import { find } from 'rxjs/operators';

@Injectable()
@UseGuards(new AuthGuard())
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
    if (!types) {
      return [];
    }
    return types.map(type => {
      return this.toResponseObject(type);
    });
  }
  async showOne(id: string): Promise<VisitTypeRO> {
    let type = await this.visitTypeRepository.findOne({
      where: { id },
    });
    if (!type) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    // check if any visit of this type exist
    const visits = await this.visitRepostitory.find({
      where: [{ visitType: `${type.id}` }],
    });
    if (visits.length > 0) {
      type = await this.visitTypeRepository.findOne({
        where: { id },
        relations: ['visits'],
      });
    }

    return this.toResponseObject(type);
  }
  // Only admin can create new one, update or delete
  async createOne(data: VisitTypeRO): Promise<VisitTypesEntity> {
    const visitType = await this.visitTypeRepository.findOne({
      where: { visitType: data.visitType },
    });
    if (visitType) {
      throw new HttpException(
        'Visit type already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const type = await this.visitTypeRepository.create({
      ...data,
    });
    await this.visitTypeRepository.save(type);
    return type;
  }

  // updateOne

  // deleteOne

  private toResponseObject(types: VisitTypesEntity): VisitTypeRO {
    return { ...types, visits: types.visits };
  }
}
