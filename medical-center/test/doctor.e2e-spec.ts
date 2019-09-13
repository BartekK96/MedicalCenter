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

beforeAll(async () => {
  await createConn();

  const patient: PatientRegisterDTO = {
    firstName: 'patientFirstName',
    lastName: 'patientLastName',
    login: 'login5',
    password: 'password',
  };

  const patientData = await axios.post(`${app}/patients/register`, patient);
  patientToken = patientData.data.token;
  patientId = patientData.data.id;
});

describe('DOCTOR', () => {
  let doctorToken: string;
  let doctorId: string;
  const doctorRegister: DoctorRegisterDTO = {
    firstName: 'doctorFirstName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login5',
    password: 'password',
  };
  const doctorLogin: DoctorLoginDTO = {
    login: 'login5',
    password: 'password',
  };
  const patientLogin: PatientLoginDTO = {
    login: 'login5',
    password: 'password',
  };
  it('should register doctor', async () => {
    return await request(app)
      .post('/doctors/register')
      .set('Accept', 'application/json')
      .send(doctorRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        doctorToken = body.token;
        expect(body.id).toBeDefined();
        doctorId = body.id;
        expect(body.firstName).toEqual(doctorRegister.firstName);
        expect(body.lastName).toEqual(doctorRegister.lastName);
        expect(body.specialization).toEqual(doctorRegister.specialization);
        expect(body.role).toEqual('doctor');
      })
      .expect(HttpStatus.CREATED);
  });
  it('should reject duplicate registartion', async () => {
    return await request(app)
      .post('/doctors/register')
      .set('Accept', 'application/json')
      .send(doctorRegister)
      .expect(({ body }) => {
        expect(body.message).toEqual('Doctor login already taken!');
        expect(HttpStatus.BAD_REQUEST);
      });
  });
  it('should login doctor', async () => {
    return await request(app)
      .post('/doctors/login')
      .set('Accept', 'application/json')
      .send(doctorLogin)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.password).toBeUndefined();
        expect(body.role).toEqual('doctor');
      });
  });
  it('should return all doctors', async () => {
    return await request(app)
      .get(`/doctors`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${patientToken}`)
      .expect(200);
  });
  it('should not return all doctors - no auth', async () => {
    return await request(app)
      .get(`/doctors`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(HttpStatus.FORBIDDEN);
      });
  });

  it('should return one doctor', async () => {
    return await request(app)
      .get(`/doctors/doctor/${doctorId}`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${patientToken}`)
      .expect(({ body }) => {
        expect(body.id).toEqual(doctorId);
      })
      .expect(200);
  });

  it('should not return one doctor', async () => {
    return await request(app)
      .get(`/doctors/doctor/${doctorId}`)
      .set('Accept', 'application/json')
      .set('auth', `JWT ${doctorToken}`)
      .expect(({ body }) => {
        expect(HttpStatus.FORBIDDEN);
      });
  });

  //   it('should return all specialization', async () => {
  //     return await request(app)
  //       .get(`/doctors/doctor`)
  //       .set('auth', `JWT ${patientToken}`)
  //       .expect(200);
  //   });
  //   it('should not return all specialization - no auth', async () => {
  //     return await request(app)
  //       .get(`/doctors/doctor`)
  //       .set('auth', `JWT`)
  //       .expect(403);
  //   });
});
