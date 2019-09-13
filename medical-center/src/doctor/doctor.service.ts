import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { Repository } from 'typeorm';
import { DoctorLoginDTO } from './doctorLogin.dto';
import { DoctorRO } from './doctor.ro';
import { DoctorRegisterDTO } from './doctorRegister.dto';
import { uuidValidator } from '../shared/uuidValidator';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
  ) {}

  async login(data: DoctorLoginDTO): Promise<DoctorRO> {
    const { login, password } = data;
    const doctor = await this.doctorRepository.findOne({
      where: { login },
    });
    if (!doctor || !(await doctor.comparePassword(password))) {
      throw new HttpException('Invalid login/password', HttpStatus.BAD_REQUEST);
    }
    // uncomment in production mode
    //  if (doctor.confirmed < 0) {
    //   throw new HttpException(
    //     'Your account is not verified',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    return doctor.toResponseObject();
  }

  async register(data: DoctorRegisterDTO): Promise<DoctorRO> {
    const { login } = data;

    let doctor = await this.doctorRepository.findOne({
      where: { login },
    });
    if (doctor) {
      throw new HttpException(
        'Doctor login already taken!',
        HttpStatus.BAD_REQUEST,
      );
    }
    // uncomment in production mode
    // if (data.confirmed >= 0) {
    //   throw new HttpException(
    //     'Confirmed options must be verified by admin!',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    doctor = await this.doctorRepository.create(data);
    await this.doctorRepository.save(doctor);
    return doctor.toResponseObject();
  }

  async showAll(): Promise<DoctorRO[]> {
    const doctors = await this.doctorRepository.find({ relations: ['visits'] });
    return doctors.map(doctor => doctor.toResponseObject(false));
  }

  async showOneDoctor(id: string): Promise<DoctorRO> {
    uuidValidator(id);
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['visits'],
    });
    if (!doctor) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(doctor);
  }

  private toResponseObject(doctor: DoctorEntity): DoctorRO {
    return doctor.toResponseObject(false);
  }

  async findDoctor(id: string): Promise<DoctorEntity> {
    uuidValidator(id);
    return await this.doctorRepository.findOne({
      where: { id },
      relations: ['visits'],
    });
  }
}
