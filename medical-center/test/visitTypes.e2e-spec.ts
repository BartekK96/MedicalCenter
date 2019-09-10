import { DoctorRegisterDTO } from 'src/doctor/doctorRegister.dto';
import axios from 'axios';
import { VisitTypeDTO } from 'src/visitTypes/visitTypes.dto';
import * as request from 'supertest';
import { app, createConn } from './constants';

let doctorToken: string;
let doctor: DoctorRegisterDTO = {
  firstName: 'doctorFirsName',
  lastName: 'doctorLastName',
  specialization: 'optist',
  login: 'login1',
  password: 'password',
};

beforeAll(async () => {
  await createConn();

  const {
    data: { token },
  } = await axios.post(`${app}/doctors/register`, doctor);
  doctorToken = token;
});

describe('VISIT_TYPES', () => {
  const visitTypes: VisitTypeDTO = {
    specialization: 'optist',
    visitType: 'optist visit',
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
      .set('auth', `JWT ${doctorToken}`)
      .set('Accept', 'application/json')
      .send(visitTypes)
      .expect((res, req) => {
        console.log(res.body);
      });
  });

  // it('should get one type of visits', () => {
  //   return request(app).get('/visit_types/');
  // });
});
