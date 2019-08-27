import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private visitRepostitory: Repository<VisitEntity>,
  ) {}

  async showAll() {
    return await this.visitRepostitory.find();
  }
  async showOne(id: string) {
    const visit = await this.visitRepostitory.findOne({ where: { id } });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return visit;
  }

  async create(data: VisitDTO) {
    const visit = await this.visitRepostitory.create(data);
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
  async update(id: string, data: Partial<VisitDTO>) {
    let visit = await this.visitRepostitory.findOne({ where: { id } });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.visitRepostitory.update({ id }, data);
    visit = await this.visitRepostitory.findOne({ where: { id } });
    return visit;
  }

  async delete(id: string) {
    const visit = await this.visitRepostitory.findOne({ where: { id } });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.visitRepostitory.delete({ id });
    return visit;
  }

  private toResponseObject(visit: VisitEntity): VisitRO {
    const responseObject: any = {
      ...visit,
    };
    return responseObject;
  }
}
