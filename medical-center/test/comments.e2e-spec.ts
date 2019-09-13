import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { CommentDTO } from 'src/comment/comment.dto';
import { HttpStatus } from '@nestjs/common';
import { async } from 'rxjs/internal/scheduler/async';

let doctorToken: string;
let doctorId: string;
let patientToken1: string;
let patientId1: string;
let patientToken2: string;
let patientId2: string;

beforeAll(async () => {
  await createConn();

  const doctor: DoctorRegisterDTO = {
    firstName: 'doctorFirstName',
    lastName: 'doctorLastName',
    specialization: 'optist',
    login: 'login2',
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
    login: 'login3',
    password: 'password',
  };

  const doctorData = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = doctorData.data.token;
  doctorId = doctorData.data.id;

  const patientData = await axios.post(`${app}/patients/register`, patient);
  patientToken1 = patientData.data.token;
  patientId1 = patientData.data.id;

  const patientData2 = await axios.post(`${app}/patients/register`, patient2);
  patientToken2 = patientData2.data.token;
  patientId2 = patientData2.data.id;
});

describe('COMMENTS', () => {
  const comment1: CommentDTO = {
    comment: 'Nice!',
    mark: 7,
  };
  const comment2: CommentDTO = {
    comment: 'Not great, not terrible',
    mark: 5,
  };
  const partComment1: any = {
    comment: 'oki',
  };
  const partComment2: any = {
    mark: 1,
  };
  const partComment3: any = {
    comment: 'Not ok',
  };
  let commentId: string;
  it('should get all comments of one doctor', async () => {
    return await request(app)
      .get(`/doctors/doctor/comments/${doctorId}`)
      .set('auth', `JWT ${patientToken1}`)
      .expect(200);
  });
  it('should add comment', async () => {
    return await request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('auth', `JWT ${patientToken1}`)
      .set('Accept', 'application/json')
      .send(comment1)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        commentId = body.id;
        expect(body.comment).toEqual(comment1.comment);
        expect(body.mark).toEqual(comment1.mark);
        expect(body.patient.id).toEqual(patientId1);
        expect(body.doctor.id).toEqual(doctorId);
      })
      .expect(HttpStatus.CREATED);
  });
  it('should not add comment - no patient authorization', async () => {
    return await request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('Accept', 'application/json')
      .send(comment1)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.FORBIDDEN);
      });
  });
  it('should not add second comment to same doctor', async () => {
    return await request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('auth', `JWT ${patientToken1}`)
      .set('Accept', 'application/json')
      .send(comment2)
      .expect(({ body }) => {
        expect(body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(body.message).toEqual('You already add comment to this doctor!');
      });
  });
  it('should not add comment - doctors can not add comment', async () => {
    return await request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('auth', `JWT ${doctorToken}`)
      .set('Accept', 'application/json')
      .send(comment2)
      .expect(({ body }) => {
        expect(body.code).toEqual(HttpStatus.FORBIDDEN);
        expect(body.message).toEqual('Token error: Access Forbidden!');
      });
  });

  it('should update first part of comment', async () => {
    return await request(app)
      .put(`/doctors/doctor/${commentId}`)
      .set('auth', `JWT ${patientToken1}`)
      .set('Accept', 'application/json')
      .send(partComment1)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        commentId = body.id;
        expect(body.comment).toEqual(partComment1.comment);
        expect(body.id).toEqual(commentId);
        expect(body.mark).toEqual(comment1.mark);
      })
      .expect(200);
  });
  it('should update second part of comment', async () => {
    return await request(app)
      .put(`/doctors/doctor/${commentId}`)
      .set('auth', `JWT ${patientToken1}`)
      .set('Accept', 'application/json')
      .send(partComment2)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        commentId = body.id;
        expect(body.mark).toEqual(partComment2.mark);
        expect(body.id).toEqual(commentId);
        expect(body.comment).toEqual(partComment1.comment);
      })
      .expect(200);
  });
  it('should not update comment - patient do not own it', async () => {
    return await request(app)
      .put(`/doctors/doctor/${commentId}`)
      .set('auth', `JWT ${patientToken2}`)
      .set('Accept', 'application/json')
      .send(partComment3)
      .expect(({ body }) => {
        expect(body.code).toEqual(HttpStatus.FORBIDDEN);
        expect(body.message).toEqual('You do not own this comment');
      });
  });
  it('should not delete comment - patient do not own it', async () => {
    return await request(app)
      .delete(`/doctors/doctor/${commentId}`)
      .set('auth', `JWT ${patientToken2}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body.code).toEqual(HttpStatus.FORBIDDEN);
        expect(body.message).toEqual('You do not own this comment');
      });
  });
  it('should delete comment', async () => {
    await axios.delete(`${app}/doctors/doctor/${commentId}`, {
      headers: { auth: `JWT ${patientToken1}` },
    });
    return request(app)
      .get(`/doctors/doctor/comments/${doctorId}`)
      .set('auth', `JWT ${patientToken1}`)
      .expect(200);
  });
});
