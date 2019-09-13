import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './patient.entity';
import { PatientRegisterDTO } from './patientRegister.dto';
import { PatientRO } from './patient.ro';
import { PatientLoginDTO } from './patientLogin.dto';
import { uuidValidator } from '../shared/uuidValidator';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async login(data: PatientLoginDTO): Promise<PatientRO> {
    const { login, password } = data;
    const patient = await this.patientRepository.findOne({ where: { login } });
    if (!patient || !(await patient.comparePassword(password))) {
      throw new HttpException('Invalid login/password', HttpStatus.BAD_REQUEST);
    }

    return patient.toResponseObject();
  }

  async register(data: PatientRegisterDTO): Promise<PatientRO> {
    const { login } = data;
    let patient = await this.patientRepository.findOne({ where: { login } });
    if (patient) {
      throw new HttpException(
        'User login already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    patient = await this.patientRepository.create(data);
    await this.patientRepository.save(patient);
    return patient.toResponseObject();
  }
  async showAll(): Promise<PatientRO[]> {
    const patients = await this.patientRepository.find();
    return patients.map(patient => patient.toResponseObject(false));
  }
  async showOne(id: string): Promise<any> {
    uuidValidator(id);
    let patient = await this.patientRepository.findOne({
      where: { id },
    });
    if (patient.visits) {
      patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['visits'],
      });
    }
    return patient.toResponseObject(false);
  }
}
