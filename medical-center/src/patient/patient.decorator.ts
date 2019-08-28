import { createParamDecorator } from '@nestjs/common';

export const Patient = createParamDecorator((data, req) => {
  return data ? req.user[data] : req.user;
});
