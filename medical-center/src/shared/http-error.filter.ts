import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error || exception.message || null
          : 'Internal Server Error',
    };

    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //   // tslint:disable-next-line:no-console
    //   console.error(exception);
    // }

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(404).json(errorResponse);
  }
}
