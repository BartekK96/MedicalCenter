import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { CommentDTO } from 'src/comment/comment.dto';
import { HttpStatus } from '@nestjs/common';
import { DoctorLoginDTO } from 'src/doctor/doctorLogin.dto';
import { PatientLoginDTO } from 'src/patient/patientLogin.dto';

let patientToken: string;
let patientId: string;
let doctorToken: string;

beforeAll(async () => {
  await createConn();

  const doctor: DoctorRegisterDTO = {
    firstName: 'doctorFirsName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login3',
    password: 'password',
  };

  const {
    data: { token },
  } = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = token;
});
describe('PATIENT', () => {
  const patientRegister: PatientRegisterDTO = {
    firstName: 'patientFirstName',
    lastName: 'patientLastName',
    login: 'login3',
    password: 'password',
  };

  const patientLogin: PatientLoginDTO = {
    login: 'login3',
    password: 'password',
  };
  it('should register new patient', async () => {
    return await request(app)
      .post('/patients/register')
      .set('Accept', 'application/json')
      .send(patientRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        patientToken = body.token;
        expect(body.id).toBeDefined();
        patientId = body.id;
        expect(body.firstName).toEqual(patientRegister.firstName);
        expect(body.lastName).toEqual(patientRegister.lastName);
        expect(body.password).toBeUndefined();
        expect(body.role).toEqual('patient');
      })
      .expect(HttpStatus.CREATED);
  });
  it('should not register duplicate register', async () => {
    return await request(app)
      .post('/patients/register')
      .set('Accept', 'application/json')
      .send(patientRegister)
      .expect(({ body }) => {
        expect(body.message).toEqual('User login already exists!');
        expect(HttpStatus.BAD_REQUEST);
      });
  });
  it('should login patient', async () => {
    return await request(app)
      .post('/patients/login')
      .set('Accept', 'application/json')
      .send(patientLogin)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.password).toBeUndefined();
        expect(body.role).toEqual('patient');
      });
  });
  it('should show all patients', async () => {
    return await request(app)
      .get(`/patients`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${doctorToken}`)
      .expect(200);
  });
  it('should not show all patients - no auth', async () => {
    return await request(app)
      .get(`/patients`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${patientToken}`)
      .expect(({ body }) => {
        expect(HttpStatus.FORBIDDEN);
        expect(body.message).toEqual('Token error: Access Forbidden!');
      });
  });
  it('should show one patients', async () => {
    return await request(app)
      .get(`/patients/${patientId}`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${doctorToken}`)
      .expect(({ body }) => {
        expect(body.password).toBeUndefined();
        expect(body.id).toEqual(patientId);
      });
  });
  it('should not show one patients - no auth', async () => {
    return await request(app)
      .get(`/patients/${patientId}`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${patientToken}`)
      .expect(({ body }) => {
        expect(HttpStatus.FORBIDDEN);
        expect(body.message).toEqual('Token error: Access Forbidden!');
      });
  });
});
