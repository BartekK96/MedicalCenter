import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';

let doctorToken: string;
let patientToken: string;
beforeAll(async () => {
  await createConn();

  const doctor: DoctorRegisterDTO = {
    firstName: 'doctorFirsName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login1',
    password: 'password',
  };

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

describe('VISIT_TYPES', () => {
  const visitTypes1: VisitTypeDTO = {
    specialization: 'optist',
    visitType: 'optist visit',
  };

  let visitTypeId: string;

  it('should get list of all visit types', () => {
    return request(app)
      .get('/visit_types')
      .set('auth', `JWT ${doctorToken}`)
      .expect(200);
  });
  it('should create visit type', () => {
    return request(app)
      .post('/visit_types')
      .set('Accept', 'application/json')
      .set('auth', `JWT ${doctorToken}`)
      .send(visitTypes1)
      .expect((res, req) => {
        expect(res.body.id).toBeDefined();
        visitTypeId = res.body.id;
        expect(res.body.specialization).toEqual(visitTypes1.specialization);
        expect(res.body.visitType).toEqual(visitTypes1.visitType);
      })
      .expect(201);
  });
  it('should not create visit type - no auth', () => {
    return request(app)
      .post('/visit_types')
      .set('Accept', 'application/json')
      .set('auth', `JWT ${patientToken}`)
      .send(visitTypes1)
      .expect((res, req) => {
        expect(res.body.id).toBeUndefined();
        expect(res.body.code).toEqual(HttpStatus.FORBIDDEN);
        expect(res.body.message).toEqual('Token error: Access Forbidden!');
      });
  });

  it('should not create visit type - visitType already exist', () => {
    return request(app)
      .post('/visit_types')
      .set('Accept', 'application/json')
      .set('auth', `JWT ${doctorToken}`)
      .send(visitTypes1)
      .expect((res, req) => {
        expect(res.body.message).toEqual('Visit type already exists!');
      });
  });

  it('should get one type of visits', () => {
    return request(app)
      .get(`/visit_types/${visitTypeId}`)
      .set('auth', `JWT ${doctorToken}`)
      .expect((res, req) => {
        expect(res.body.specialization).toEqual(visitTypes1.specialization);
        expect(res.body.visitType).toEqual(visitTypes1.visitType);
      })
      .expect(200);
  });
});
