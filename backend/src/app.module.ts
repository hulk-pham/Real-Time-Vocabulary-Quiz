import { Module } from '@nestjs/common';
import { QuizsModule } from './app';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, DatabaseModule } from './common';

@Module({
  imports: [
    ConfigModule,
    QuizsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
