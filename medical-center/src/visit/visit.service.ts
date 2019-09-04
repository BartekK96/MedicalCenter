import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { PatientEntity } from '../patient/patient.entity';
import { booleanLiteral } from '@babel/types';
import { PatientRO } from '../patient/patient.ro';

// need to upgrade response object

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private visitRepostitory: Repository<VisitEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(VisitTypesEntity)
    private visitTypeRepository: Repository<VisitTypesEntity>,
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async showAll(): Promise<VisitRO[]> {
    const visits = await this.visitRepostitory.find({ relations: ['doctor'] });
    return visits.map(visit => {
      return this.toResponseObject(visit);
    });
  }

  // need to hide doctor login and password in response object
  async showOne(id: string): Promise<VisitRO> {
    const visit = await this.visitRepostitory.findOne({
      where: { id },
      relations: ['doctor', 'patient', 'visitType'],
    });
    if (!visit) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(visit);
  }

  private toResponseObject(visit: VisitEntity): any {
    return {
      ...visit,
      doctor: visit.doctor.toResponseObject(false),
      visitType: visit.visitType,
      patient: visit.patient.toResponseObject(false),
    };
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

  async delete(id: string): Promise<VisitEntity> {
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

  // private toResponseObject(visit: VisitEntity): VisitRO {
  //   return {
  //     ...visit,
  //     doctor: visit.doctor,
  //     visitType: visit.visitType,
  //     patient: visit.patient,
  //   };
  // }
  // need to add minimum breaks beeteween patients 15 min
  async create(doctorId: string, data: VisitEntity): Promise<VisitEntity> {
    // <VisitRO>
    const doc = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    const type = await this.checkIfVisitTypeExist(data);
    await this.checkIfDataAndTimeExists(data, doctorId);

    const visit = await this.visitRepostitory.create({
      ...data,
      doctor: doc.toResponseObject(),
      visitType: type,
    });

    await this.visitRepostitory.save(visit);
    return visit; // this.toResponseObject(visit);
  }
  private async checkIfVisitTypeExist(
    data: VisitEntity,
  ): Promise<VisitTypesEntity> {
    const types = await this.visitTypeRepository.find();
    let typeId;
    const type = types.filter(kind => {
      if (kind.visitType === String(data.visitType)) {
        typeId = kind.id;
        return kind.visitType;
      }
      return false;
    });
    if (type.length < 1) {
      throw new HttpException(
        'This kind of visit does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const typ = await this.visitTypeRepository.findOne({ where: { typeId } });
    return typ;
  }
  private async checkIfDataAndTimeExists(
    data: VisitEntity,
    doctorId: string,
  ): Promise<boolean> {
    const date = await this.visitRepostitory.find({
      where: { date: data.date, time: data.time },
      relations: ['doctor'],
    });
    const exist = date.filter(visit => {
      if (visit.doctor.id === doctorId) {
        return true;
      }
      return false;
    });
    if (date.length < 1 && exist.length < 1) {
      return true;
    }
    throw new HttpException(
      'This date and time of your visit already exists!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async undoVisit(patientId, id) {
    return true;
  }
  // need to add response object
  async reserveVisit(patientId: string, visitId: string): Promise<VisitDTO> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    let visit = await this.visitRepostitory.findOne({
      where: { id: visitId },
      relations: ['doctor'],
    });

    if (!visit) {
      throw new HttpException('Visit does not exist!', HttpStatus.BAD_REQUEST);
    }

    await this.checkIfVisitAvailable(visit);
    visit = { ...visit, patient };

    await this.visitRepostitory.save(visit);
    return visit;
  }

  private async checkIfVisitAvailable(visit: VisitEntity): Promise<boolean> {
    if (visit.available) {
      visit.available = false;
      return true;
    }
    throw new HttpException('Visit is not available', HttpStatus.BAD_REQUEST);
  }
}
