import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
	User,
	UserScores,
	QuizSession,
} from './entities';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const config: TypeOrmModuleOptions = {
					type: 'mysql',
					host: configService.get<string>('DB_HOST'),
					port: configService.get<number>('DB_PORT'),
					username: configService.get<string>('DB_USERNAME'),
					password: configService.get<string>('DB_PASSWORD'),
					database: configService.get<string>('DB_NAME'),
					autoLoadEntities: true,
					migrationsTableName: `migrations`,
					migrations: [],
					entities: [
						User,
						UserScores,
						QuizSession,
					],
					migrationsRun: false,
					synchronize: false,
					namingStrategy: new SnakeNamingStrategy(),
					logging: false
				};
				return config;
			}
		}),
		ConfigModule
	]
})
export class DatabaseModule {}
