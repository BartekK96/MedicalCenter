import { createParamDecorator } from '@nestjs/common';

export const Doctor = createParamDecorator((data, req) => {
  return data ? req.user[data] : req.user;
});
