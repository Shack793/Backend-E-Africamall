import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, { data: T; statusCode: number }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T; statusCode: number }> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode || 200,
        data,
      })),
    );
  }
}
