import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 0,
        });
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
