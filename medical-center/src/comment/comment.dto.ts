import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
  @IsNotEmpty()
  comment: string;

  // @IsNotEmpty()
  // patient: string;

  // @IsNotEmpty()
  // doctor: string;

  @IsNotEmpty()
  mark: number;
}
