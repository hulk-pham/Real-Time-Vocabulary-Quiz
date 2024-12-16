import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { METADATA_KEY } from '../constants';
import { CacheService } from './cache.service';

@Global()
@Module({
	providers: [
		{
			provide: METADATA_KEY.REDIS,
			useFactory(config: ConfigService) {
				return new Redis({
					port: config.get('REDIS_PORT'),
					host: config.get('REDIS_HOST'),
					db: config.get('REDIS_DB'),
					password: config.get('REDIS_PASSWORD'),
					keyPrefix: config.get('REDIS_PREFIX')
				});
			},
			inject: [ConfigService]
		},
		CacheService
	],
	exports: [CacheService]
})
export class CacheModule { }
