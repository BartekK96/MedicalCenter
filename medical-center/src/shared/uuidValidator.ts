import { HttpException, HttpCode, HttpStatus } from '@nestjs/common';

export const uuidValidator = (uuid: string) => {
  if (
    uuid.match(
      '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
    )
  ) {
    return true;
  }
  throw new HttpException(
    'This kind of id is incorret!',
    HttpStatus.BAD_REQUEST,
  );
};
