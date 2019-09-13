import {
  IsNotEmpty,
  IsBooleanString,
  IsNegative,
  IsNumber,
} from 'class-validator';
import { isBoolean } from 'util';

export class DoctorRegisterDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  specialization: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;

  // uncomment in production mode
  // @IsNumber()
  // confirmed: number;
}
