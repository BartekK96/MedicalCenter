import { IsNotEmpty } from 'class-validator';

export class PatientDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
