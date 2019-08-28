import { IsNotEmpty } from 'class-validator';

export class DoctorLoginDTO {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
