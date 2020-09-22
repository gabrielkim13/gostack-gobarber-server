import Redis, { Redis as RedisType } from 'ioredis';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private redis: RedisType;

  constructor() {
    this.redis = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.redis.keys(`${prefix}:*`);

    const pipeline = this.redis.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}

export default RedisCacheProvider;
