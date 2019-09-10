import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PatientGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.auth) {
      return false;
    }

    const user = await this.validateToken(request.headers.auth);

    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'JWT') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);

      const values = Object.keys(decoded).map(key => decoded[key]);

      if (values[2] !== 'patient') {
        throw new HttpException('Access Forbidden!', HttpStatus.FORBIDDEN);
      }
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
