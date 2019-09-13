import { IsNotEmpty } from 'class-validator';

export class PatientLoginDTO {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
