import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitDTO } from './visit.dto';
import { VisitRO } from './visit.ro';
import { DoctorEntity } from '../doctor/doctor.entity';
import { VisitTypesEntity } from '../visitTypes/visitTypes.entity';
import { VisitTypeRO } from '../visitTypes/visitTypes.ro';
import { PatientEntity } from '../patient/patient.entity';
import { uuidValidator } from '../shared/uuidValidator';

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

  async showOne(id: string): Promise<VisitRO> {
    uuidValidator(id);
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
    if (visit.patient !== null) {
      return {
        ...visit,
        doctor: visit.doctor.toResponseObject(false),
        visitType: visit.visitType,
        patient: visit.patient.toResponseObject(false),
      };
    } else {
      return {
        ...visit,
        doctor: visit.doctor.toResponseObject(false),
        visitType: visit.visitType,
        patient: null,
      };
    }
  }

  async showOneDoctorVisits(id: string): Promise<VisitEntity[]> {
    uuidValidator(id);
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['visits'],
    });

    const availabeVisits: VisitEntity[] = doctor.visits.map(visit => {
      if (visit.available) {
        return visit;
      }
    });
    return availabeVisits;
  }

  async showAllTypes(): Promise<VisitTypeRO[]> {
    const types = await this.visitTypeRepository.find();
    return types.map(type => {
      return type.toResponseObject();
    });
  }

  async showOneType(id: string): Promise<VisitRO[]> {
    uuidValidator(id);
    const type = await this.visitTypeRepository.findOne({
      where: { id },
    });

    const visits = await this.visitRepostitory.find({
      where: { visitType: type },
      relations: ['doctor', 'patient', 'visitType'],
    });
    if (visits) {
      return visits.map(visit => {
        if (visit.available) {
          return this.toResponseObject(visit);
        }
      });
    }
    throw new HttpException(
      'There is no availabe visit of this type',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: string, data: Partial<VisitDTO>): Promise<VisitRO> {
    uuidValidator(id);
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
    uuidValidator(id);
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

  // need to add validation for receiving Date format (only dd.mm.yyyy should be available)
  async create(doctorId: string, data: VisitEntity): Promise<VisitEntity> {
    uuidValidator(doctorId);
    const doc = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    // await this.checkDataCorrectness(data);

    const type = await this.checkIfVisitTypeExist(data);

    await this.checkIfDataAndTimeExists(data, doctorId);
    await this.checkIfTimeIsCorrect(data);
    await this.checkSpecialization(type, doctorId);
    await this.checkIfBreakBetweenVisitIsOptional(data, doctorId); // 10 minutes

    const visit = await this.visitRepostitory.create({
      ...data,
      doctor: doc.toResponseObject(),
      visitType: type,
    });

    await this.visitRepostitory.save(visit);
    return visit;
  }

  private async checkSpecialization(
    data: VisitTypesEntity,
    doctorId: string,
  ): Promise<boolean> {
    const doctor = await this.doctorRepository.find({
      where: { id: doctorId },
      join: {
        alias: 'doctor',
        leftJoinAndSelect: {
          visits: 'doctor.visits',
        },
      },
    });

    if (doctor[0].specialization !== data.specialization) {
      throw new HttpException(
        'This visit is not possible with your specialization',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  private async checkIfBreakBetweenVisitIsOptional(
    data: VisitEntity,
    doctorId: string,
  ): Promise<boolean> {
    const doctor = await this.doctorRepository.find({
      where: { id: doctorId },
      join: {
        alias: 'doctor',
        leftJoinAndSelect: {
          visits: 'doctor.visits',
        },
      },
    });
    // it should be upgraded
    const pause = doctor[0].visits.map(visit => {
      const year = String(visit.date).split('-')[0];
      const month = String(visit.date).split('-')[1];
      const day = String(visit.date).split('-')[2];
      const hour = visit.time.split(':')[0];
      const minutes = visit.time.split(':')[1];
      const second = visit.time.split(':')[2];

      const newVisitYear = String(data.date).split('.')[2];
      const newVisitMonth = String(data.date).split('.')[1];
      const newVisitDay = String(data.date).split('.')[0];

      const newVisitHour = data.time.split(':')[0];
      const newVisitMinutes = data.time.split(':')[1];

      if (year === newVisitYear) {
        if (month === newVisitMonth) {
          if (day === newVisitDay) {
            if (hour === newVisitHour) {
              if (Number(newVisitMinutes) - Number(minutes) < 10) {
                throw new HttpException(
                  'Breaks beetween visit need to be minimum 10 minutes!',
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }
        }
      }
    });
    return true;
  }
  private async checkIfTimeIsCorrect(data: VisitEntity): Promise<boolean> {
    const date = await this.visitRepostitory.find({
      where: { date: data.date, time: data.time },
    });
    const minutes = data.time.split(':')[1];
    const seconds = data.time.split(':')[2];
    if (seconds) {
      throw new HttpException(
        'Visit time can not contain seconds!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const rest1 = Number(minutes) % 15;
    const rest2 = Number(minutes) % 10;

    if (rest1 !== 0 && rest2 !== 0) {
      throw new HttpException(
        'Visit time should be multiple of 10 or 15',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  private async checkIfVisitTypeExist(
    data: VisitEntity,
  ): Promise<VisitTypesEntity> {
    const types = await this.visitTypeRepository.find();
    let typeId;
    const type = types.filter(kind => {
      Logger.log('>>>>>>>>>>>>>' + kind.visitType);
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

    if (exist.length < 1) {
      return true;
    }
    throw new HttpException(
      'This date and time of your visit already exists!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async undoVisit(patientId: string, visitId: string) {
    uuidValidator(patientId);
    uuidValidator(visitId);
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['visits'],
    });

    let visit = await this.visitRepostitory.findOne({
      where: { id: visitId },
      relations: ['patient'],
    });

    if (!visit) {
      throw new HttpException('Visit does not exist!', HttpStatus.BAD_REQUEST);
    }

    await this.checkIfVisitBelongsToPatient(visit, patient);
    visit = await this.visitRepostitory.findOne({
      where: { id: visitId },
      relations: ['doctor', 'visitType'],
    });
    visit = await this.removeVisitFromPatient(visit, patient);

    return visit; // this.toResponseObject(visit);
  }
  private async checkIfVisitBelongsToPatient(
    visit: VisitEntity,
    patient: PatientEntity,
  ): Promise<boolean> {
    if (visit.patient === null) {
      throw new HttpException(
        'None of patients are asign to this visit!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (visit.patient.id === patient.id) {
      return true;
    }
    throw new HttpException(
      'This visit does not belongs to You!',
      HttpStatus.BAD_REQUEST,
    );
  }
  private async removeVisitFromPatient(
    visit: VisitEntity,
    patient: PatientEntity,
  ): Promise<any> {
    delete visit.update;
    visit.available = true;
    const updatedVisit = { ...visit, patient: null };

    await this.visitRepostitory.update({ id: visit.id }, updatedVisit);

    return updatedVisit;
  }
  async reserveVisit(patientId: string, visitId: string): Promise<VisitDTO> {
    uuidValidator(visitId);
    uuidValidator(patientId);
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
    return this.toResponseObject(visit);
  }

  private async checkIfVisitAvailable(visit: VisitEntity): Promise<boolean> {
    if (visit.available) {
      visit.available = false;
      return true;
    }
    throw new HttpException('Visit is not available', HttpStatus.BAD_REQUEST);
  }
}
