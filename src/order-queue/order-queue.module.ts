import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderQueueProcessor } from './order-queue.processor';
import { redisConfig } from '../config/redis.config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order',
      connection: redisConfig.connection,
    }),
  ],
  providers: [OrderQueueProcessor],
  exports: [BullModule],
})
export class OrderQueueModule {}
