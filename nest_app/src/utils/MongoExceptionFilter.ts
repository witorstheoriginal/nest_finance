import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

// TODO: only catch Mongo or Mongoose errors
@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let error;

    switch (exception.name) {
      /*  case 'ValidationError':
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Incompatible parameter type',
        };
        break; */
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: exception.message,
        };
        break;
      }
    }
    response.status(error.statusCode).json(error);
  }
}
