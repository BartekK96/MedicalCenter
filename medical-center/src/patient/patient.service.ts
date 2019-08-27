import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './patient.entity';
import { PatientDTO } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async login(data: PatientDTO) {
    const { firstName, lastName, login, password } = data;
    const patient = await this.patientRepository.findOne({ where: { login } });
    if (!patient || (await patient.comparePassword(password))) {
      throw new HttpException('Invalid login/password', HttpStatus.BAD_REQUEST);
    }
    return patient.toResponseObject;
  }
  async register(data: PatientDTO) {
    const { firstName, lastName, login, password } = data;
    let patient = await this.patientRepository.findOne({ where: { login } });
    if (patient) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }
    patient = await this.patientRepository.create(data);
    await this.patientRepository.save(data);
    return patient.toResponseObject();
  }
  async showAll() {
    const patients = await this.patientRepository.find();
    return patients.map(patient => patient.toResponseObject(false));
  }
}
