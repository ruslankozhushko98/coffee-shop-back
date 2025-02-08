import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  public get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  public async set(key: string, value: string): Promise<'OK'> {
    return this.redisClient.set(key, value);
  }

  public async delete(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
