import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { METADATA_KEY } from 'src/common/constants';

@Injectable()
export class CacheService {
	constructor(@Inject(METADATA_KEY.REDIS) private redis: Redis) { }

	async set(key: string, value: string, expired: string | number): Promise<'OK'> {
		await this.del(key);
		return this.redis.set(key, value, 'EX', expired);
	}

	async setNx(key: string, value: string): Promise<number> {
		await this.del(key);
		return this.redis.setnx(key, value);
	}

	get(key: string): Promise<string | null> {
		return this.redis.get(key);
	}

	getMany(keys: string[]): Promise<string[]> {
		return this.redis.mget(keys);
	}

	del(key: string) {
		return this.redis.del(key);
	}

	keys(prefix: string) {
		return this.redis.keys(`${prefix}:*`);
	}

	zadd(key: string, score: number, member: string) {
		return this.redis.zadd(key, score, member);
	}

	zget(key: string, member: string) {
		return this.redis.zscore(key, member);
	}

	zrangeWithScores(key: string, start: number, stop: number) {
		return this.redis.zrevrange(key, start, stop, 'WITHSCORES');
	}
}
