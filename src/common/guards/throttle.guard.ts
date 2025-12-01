import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

const RATE_LIMIT = 10; 
const TIME_WINDOW = 60000; 
const requestMap = new Map<string, { count: number; firstRequest: number }>();

@Injectable()
export default class ThrottleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.ip; 

    const now = Date.now();
    const record = requestMap.get(key) || { count: 0, firstRequest: now };

    if (now - record.firstRequest > TIME_WINDOW) {
      record.count = 1;
      record.firstRequest = now;
    } else {
      record.count++;
    }

    requestMap.set(key, record);

    if (record.count > RATE_LIMIT) {
      throw new BadRequestException('Too many requests, please try again later.');
    }

    return true;
  }
}
