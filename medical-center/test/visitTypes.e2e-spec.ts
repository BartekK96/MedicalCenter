import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { response } from 'express';

// need to add admins authorization tests in future

let doctorToken: string;
let doctor: DoctorRegisterDTO = {
  firstName: 'doctorFirsName',
  lastName: 'doctorLastName',
  specialization: 'optist',
  login: 'login1',
  password: 'password',
};
let patientToken: string;
let patient: PatientRegisterDTO = {
  firstName: 'patientFirstName',
  lastName: 'patientLastName',
  login: 'login1',
  password: 'password',
};
beforeAll(async () => {
  await createConn();

  const {
    data: { token },
  } = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = token;
  const patientData = await axios.post(`${app}/patients/register`, doctor);
  patientToken = patientData.data.token;
});

describe('VISIT_TYPES', () => {
  const visitTypes1: VisitTypeDTO = {
    specialization: 'optist',
    visitType: 'optist visit',
  };
  const visitTypes2: VisitTypeDTO = {
    specialization: 'surgery',
    visitType: 'surgery visit',
  };

  let visitTypeId: string;

  it('should get list of all visit types', () => {
    return request(app)
      .get('/visit_types')
      .expect(200);
  });

  it('should create visit type', () => {
    return request(app)
      .post('/visit_types')
      .set('Accept', 'application/json')
      .send(visitTypes1)
      .expect((res, req) => {
        expect(res.body.id).toBeDefined();
        visitTypeId = res.body.id;
        expect(res.body.specialization).toEqual(visitTypes1.specialization);
        expect(res.body.visitType).toEqual(visitTypes1.visitType);
      })
      .expect(201);
  });

  it('should not create visit type - visitType already exist', () => {
    return request(app)
      .post('/visit_types')
      .set('Accept', 'application/json')
      .send(visitTypes1)
      .expect((res, req) => {
        expect(res.body.message).toEqual('Visit type already exists!');
      });
  });

  it('should get one type of visits', () => {
    return request(app)
      .get(`/visit_types/${visitTypeId}`)
      .expect((res, req) => {
        expect(res.body.specialization).toEqual(visitTypes1.specialization);
        expect(res.body.visitType).toEqual(visitTypes1.visitType);
      })
      .expect(200);
  });
});
