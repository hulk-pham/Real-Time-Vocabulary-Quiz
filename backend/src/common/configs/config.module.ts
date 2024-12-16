import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

console.log(process.env)

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			// envFilePath: '.env',
			// validationSchema: Joi.object({
			// 	NODE_ENV: Joi.string(),
			// 	PORT: Joi.number(),

			// 	DB_HOST: Joi.string(),
			// 	DB_PORT: Joi.number(),
			// 	DB_USERNAME: Joi.string(),
			// 	DB_PASSWORD: Joi.string(),
			// 	DB_NAME: Joi.string(),

			// 	REDIS_HOST: Joi.string().default('localhost'),
			// 	REDIS_PORT: Joi.number().default(6379),
			// 	REDIS_DB: Joi.number().default(1),
			// 	REDIS_PASSWORD: Joi.string(),
			// 	REDIS_PREFIX: Joi.string(),
			// })
		})
	]
})
export class ConfigModule {}
