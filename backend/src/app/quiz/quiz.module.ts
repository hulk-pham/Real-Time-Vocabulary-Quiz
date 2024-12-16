import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSession, User, UserScores } from 'src/common/database/entities';
import { QuizsGateway } from './quiz.gateway';
import { QuizService } from './quiz.service';
import { CacheModule } from 'src/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserScores, QuizSession]),
    CacheModule,
  ],
  providers: [QuizsGateway, QuizService],
})
export class QuizsModule { }