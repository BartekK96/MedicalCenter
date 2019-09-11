import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';
import { PatientRegisterDTO } from 'src/patient/patientRegister.dto';
import { CommentDTO } from 'src/comment/comment.dto';
import { HttpStatus } from '@nestjs/common';

let doctorToken: string;
let doctorId: string;
const doctor: DoctorRegisterDTO = {
  firstName: 'doctorFirstName',
  lastName: 'doctorLastName',
  specialization: 'optist',
  login: 'login2',
  password: 'password',
};
let patientToken: string;
let patientId: string;
const patient: PatientRegisterDTO = {
  firstName: 'patientFirstName',
  lastName: 'patientLastName',
  login: 'login2',
  password: 'password',
};
beforeAll(async () => {
  await createConn();

  const doctorData = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = doctorData.data.token;
  doctorId = doctorData.data.id;

  const patientData = await axios.post(`${app}/patients/register`, patient);
  patientToken = patientData.data.token;
  patientId = patientData.data.id;
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
  let commentId: string;
  it('should get all comments of one docotr', () => {
    return request(app)
      .get(`/doctors/doctor/comments/${doctorId}`)
      .set('auth', `JWT ${patientToken}`)
      .expect(200);
  });
  it('should add comment', () => {
    return request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .send(comment1)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        commentId = body.id;
        expect(body.comment).toEqual(comment1.comment);
        expect(body.mark).toEqual(comment1.mark);
        expect(body.patient.id).toEqual(patientId);
        expect(body.doctor.id).toEqual(doctorId);
      })
      .expect(HttpStatus.CREATED);
  });
  it('should not add comment - no patient authorization', () => {
    return request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('Accept', 'application/json')
      .send(comment1)
      .expect((res, req) => {
        expect(res.body.code).toEqual(HttpStatus.FORBIDDEN);
      });
  });
  it('should not add second comment to same doctor', () => {
    return request(app)
      .post(`/doctors/doctor/${doctorId}`)
      .set('auth', `JWT ${patientToken}`)
      .set('Accept', 'application/json')
      .send(comment2)
      .expect(({ body }) => {
        console.log(body);
        expect(body.code).toEqual(HttpStatus.BAD_REQUEST);
        expect(body.message).toEqual('You already add comment to this doctor!');
      });
  });
  //   it('should not add comment - doctors can not add comment to another doctor', () => {});
  //   it('should not add comment - doctors can not add comment to themselfs', () => {});
  //   it('should update comment', () => {});
  //   it('should not update comment - patient do not own it', () => {});
  //   it('should delete comment', () => {});
  //   it('should not delete comment - patient do not own it', () => {});
});
