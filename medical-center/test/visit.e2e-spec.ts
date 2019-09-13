import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';

beforeAll(async () => {
  await createConn();

  let doctorToken: string;
  const doctor: DoctorRegisterDTO = {
    firstName: 'doctorFirsName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login1',
    password: 'password',
  };
  let patientToken: string;
  const patient: PatientRegisterDTO = {
    firstName: 'patientFirstName',
    lastName: 'patientLastName',
    login: 'login1',
    password: 'password',
  };

  const {
    data: { token },
  } = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = token;
  const patientData = await axios.post(`${app}/patients/register`, patient);
  patientToken = patientData.data.token;
});

describe('VISIT', () => {
  it('should return all visit one type', () => {
    return true;
  });
});
