import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class MysqlExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MysqlExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.BAD_REQUEST;
    let message: string | string[] = 'Database error';

    const err: any = exception;

    if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry error';
    }

    this.logger.error(`Database Error: ${JSON.stringify(err)}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
