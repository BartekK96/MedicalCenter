import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Injectable()
export class DoctorGuard implements CanActivate {
  // tslint:disable-next-line:no-empty
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const doctor = request.doctor;
    Logger.log(doctor);
    // if (doctor.role === 'doctor') {
    //   return true;
    // }
    return true;
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
