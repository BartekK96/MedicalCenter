import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { HttpStatus } from '@nestjs/common';

let doctorToken1: string;
let doctorId1: string;
let doctorSpecialization1: string;
let doctorToken2: string;
let doctorId2: string;
let doctorSpecialization2: string;
let patientId: string;
let patientToken: string;
let patientId2: string;
let patientToken2: string;
let visitTypeId: string;

beforeAll(async () => {
  await createConn();

  const doctor: DoctorRegisterDTO = {
    firstName: 'doctorFirsName',
    lastName: 'doctorLastName',
    specialization: 'surgery',
    login: 'login2',
    password: 'password',
  };
  const doc: DoctorRegisterDTO = {
    firstName: 'doctorFirsName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login22',
    password: 'password',
  };

  const patient: PatientRegisterDTO = {
    firstName: 'patientFirstName',
    lastName: 'patientLastName',
    login: 'login2',
    password: 'password',
  };
  const patient2: PatientRegisterDTO = {
    firstName: 'patientFirstName',
    lastName: 'patientLastName',
    login: 'login22',
    password: 'password',
  };

  const visitType: VisitTypeDTO = {
    specialization: 'surgery',
    visitType: 'USG',
  };

  const doc1Data = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken1 = doc1Data.data.token;
  doctorId1 = doc1Data.data.id;
  doctorSpecialization1 = doc1Data.data.specialization;

  const docData = await axios.post(`${app}/doctors/register`, doc);
  doctorToken2 = docData.data.token;
  doctorId2 = docData.data.id;
  doctorSpecialization2 = docData.data.specialization;

  const patientData = await axios.post(`${app}/patients/register`, patient);
  patientToken = patientData.data.token;
  patientId = patientData.data.id;

  const patientData2 = await axios.post(`${app}/patients/register`, patient2);
  patientToken2 = patientData2.data.token;
  patientId2 = patientData2.data.id;

  const visitTypeData = await axios.post(`${app}/visit_types`, visitType, {
    headers: { auth: `JWT ${doctorToken1}` },
  });
  visitTypeId = visitTypeData.data.id;
});

describe('VISIT', () => {
  let visit1Id;

  const visit1 = {
    date: '01.01.2012',
    time: '12:20',
    visitType: 'USG',
  };
  const visit2 = {
    date: '01.01.2012',
    time: '12:29',
    visitType: 'USG',
  };
  const visit3 = {
    date: '01.01.2012',
    time: '12:31',
    visitType: 'USG',
  };
  it('should create visit', async () => {
    return await request(app)
      .post(`/visits`)
      .set('auth', `JWT ${doctorToken1}`)
      .set('Accept', 'application/json')
      .send(visit1)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        visit1Id = body.id;
        expect(body.date).toEqual(visit1.date);
        expect(body.time).toEqual(visit1.time);
        expect(body.visitType.visitType).toEqual(visit1.visitType);
        expect(body.visitType.specialization).toEqual(doctorSpecialization1);
        expect(body.doctor.id).toEqual(doctorId1);
      })
      .expect(HttpStatus.CREATED);
  });
  it('should not create visit - doctor specialization incorrect', async () => {
    return await request(app)
      .post(`/visits`)
      .set('auth', `JWT ${doctorToken2}`)
      .set('Accept', 'application/json')
      .send(visit1)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual(
          'This visit is not possible with your specialization',
        );
      });
  });

  it('should not create visit - no doctor auth', async () => {
    return await request(app)
      .post(`/visits`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .send(visit2)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.FORBIDDEN);
        expect(res.body.message).toEqual('Token error: Access Forbidden!');
      });
  });

  it('should not create visit - minimal time beetween visits is too short(10 minutes is minimum)', async () => {
    return await request(app)
      .post(`/visits`)
      .set('auth', `JWT ${doctorToken1}`)
      .set('Accept', 'application/json')
      .send(visit2)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
      });
  });
  it('should not create visit - time of visit must be iteration of 10 or 15 minutes', async () => {
    return await request(app)
      .post(`/visits`)
      .set('auth', `JWT ${doctorToken1}`)
      .set('Accept', 'application/json')
      .send(visit3)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual(
          'Visit time should be multiple of 10 or 15',
        );
      });
  });
  it('should show all visit types', async () => {
    return await request(app)
      .get('/visits/types')
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect(200);
  });
  it('should show one type visits which are available', async () => {
    return await request(app)
      .get(`/visits/types/${visitTypeId}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        const visits = body.map(visit => {
          if (visit.available) {
            return true;
          }
        });
        expect(visits[0]).toBeTruthy();
      })
      .expect(200);
  });
  it('should show one visit', async () => {
    return await request(app)
      .get(`/visits/visit/${visit1Id}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body.id).toEqual(visit1Id);
      })
      .expect(200);
  });
  it('should show all available visits of one doctor', async () => {
    return await request(app)
      .get(`/visits/doctor/${doctorId1}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        const visits = body.map(visit => {
          if (visit.available) {
            return true;
          }
        });
        expect(visits[0]).toBeTruthy();
      })
      .expect(200);
  });
  it('should reserve visit', async () => {
    return await request(app)
      .post(`/visits/reserve/${visit1Id}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.available).toBeFalsy();
        expect(res.body.patient.id).toEqual(patientId);
      })
      .expect(HttpStatus.CREATED);
  });
  it('should not reserve visit - visit does not exist', async () => {
    return await request(app)
      .post(`/visits/reserve/asd`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('This kind of id is incorret!');
      });
  });
  it('should not reserve visit - visit is already reserved', async () => {
    return await request(app)
      .post(`/visits/reserve/${visit1Id}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('Visit is not available');
      });
  });
  it('should not undo visit - you do not own this visit', async () => {
    return await request(app)
      .post(`/visits/undo/${visit1Id}`)
      .set('auth', `JWT ${patientToken2}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('This visit does not belongs to You!');
      });
  });
  // it is optional
  // it('should not undo visit - 24h before visit you can not cancel visit', () => {});

  it('should undo visit', async () => {
    return await request(app)
      .post(`/visits/undo/${visit1Id}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.available).toBeTruthy();
        expect(res.body.patient).toBeNull();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should not undo visit - none of patient are asign to this visit', async () => {
    return await request(app)
      .post(`/visits/undo/${visit1Id}`)
      .set('auth', `JWT ${patientToken2}`)
      .set('Accept', 'application/json')
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual(
          'None of patients are asign to this visit!',
        );
      });
  });
});
