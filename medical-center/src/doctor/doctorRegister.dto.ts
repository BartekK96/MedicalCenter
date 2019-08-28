import { IsNotEmpty } from 'class-validator';

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
}
