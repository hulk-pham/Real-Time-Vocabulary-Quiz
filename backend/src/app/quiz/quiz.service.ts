import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { CacheService } from 'src/common';
import { EVENT_KEY, NUMBER_OF_QUESTION, QUESTIONS, REDIS_KEYS } from 'src/common/constants';
import { QuizSession, User, UserScores } from 'src/common/database/entities';
import { shuffleArray } from 'src/common/utils';
import { In, Repository } from 'typeorm';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { JoinQuizSessionDto } from './dto/join-quiz.dto';
import { SubmitQuizSessionDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(QuizSession) private readonly quizSessionRepository: Repository<QuizSession>,
    @InjectRepository(UserScores) private readonly userScoresRepository: Repository<UserScores>,
    private readonly cacheService: CacheService,
  ) { }

  async joinQuizSession(data: JoinQuizSessionDto, socket: Socket) {
    const quizId = data.quizId;
    const userName = data.userName;

    const user = await this.saveUser(userName);
    const quizSession = await this.saveQuizSession(quizId);
    const userScores = await this.saveUserScores(user.id, quizSession.id, 0);
    const attendedUsers = await this.userScoresRepository.find({
      where: {
        quizSessionId: quizSession.id,
      },
    });

    const output = {
      user,
      quizSession: {
        ...quizSession,
        attendedUsersLength: attendedUsers.length,
      },
      userScores,
    }

    await this.addScoresToLeaderboard(quizSession.id, user.id, 0);
    this.joinQuizSessionRoom(quizSession.id, socket);

    return output;
  }

  async getQuizQuestions() {
    const questions = shuffleArray(QUESTIONS).slice(0, NUMBER_OF_QUESTION);
    return questions;
  }

  async getLeaderboard(data: GetLeaderboardDto) {
    const quizSessionId = data.quizSessionId;
    const leaderboards = await this.getLeaderboardFromCache(quizSessionId);

    if (leaderboards) {
      const userCachedIds = leaderboards.map((result) => this.userCacheDataKey(result.userId))
      const userCached = await this.cacheService.getMany(userCachedIds);
      
      // load user data from cache to leaderboards
      for (let userStr of userCached) {
        const user = JSON.parse(userStr);
        if (user) {
          const item = leaderboards.find((result) => result.userId === user.id);
          item.user = user;
        }
      }

      // load user data from database to leaderboards if missing in cache
      const missCachedUserIds = leaderboards.filter((result) => !result.user).map((result) => result.userId);
      const usersOriginData = await this.userRepository.find({
        where: {
          id: In(missCachedUserIds),
        },
      })
      for (let user of usersOriginData) {
        const item = leaderboards.find((result) => result.userId === user.id);
        item.user = user;
        await this.setUserDataToCache(user);
      }

      return leaderboards;
    } else {
      const leaderboards = await this.userScoresRepository.find({
        where: {
          quizSessionId: quizSessionId,
        },
        relations: ['user'],
        order: {
          scores: 'DESC',
        }
      });

      for (const leaderboard of leaderboards) {
        await this.addScoresToLeaderboard(quizSessionId, leaderboard.userId, leaderboard.scores);
        await this.setUserDataToCache(leaderboard.user);
      }

      return leaderboards;
    }
  }

  async submitQuizAnswer(data: SubmitQuizSessionDto, socket: Socket) {
    const quizSessionId = data.quizSessionId;
    const userId = data.userId;
    const answers = data.answers;

    const numberOfCorrectAnswer = answers.reduce((acc, answer) => {
      const question = QUESTIONS.find((question) => question.id === answer.id);
      if (question.answer === answer.answer) {
        acc++;
      }
      return acc;
    }, 0);

    const scores = numberOfCorrectAnswer * (100 / NUMBER_OF_QUESTION);

    const userScores = await this.saveUserScores(userId, quizSessionId, scores);
    await this.addScoresToLeaderboard(quizSessionId, userId, scores);
    const leaderboards = await this.getLeaderboard({ quizSessionId });
    await this.emitLeaderboardChanges(quizSessionId, leaderboards, socket);
    return {
      leaderboards,
      userScores
    };
  }

  private async saveQuizSession(quizId: string) {
    let quizSession = await this.quizSessionRepository.findOne({
      where: {
        quizId: quizId,
      },
    });

    if (!quizSession) {
      quizSession = await this.quizSessionRepository.save({
        quizId: quizId,
      });
    }
    return quizSession;
  }

  private async saveUser(userName: string) {
    let user = await this.userRepository.findOne({
      where: {
        name: userName,
      },
    });

    if (!user) {
      user = await this.userRepository.save({
        name: userName,
      });
    }

    return user;
  }

  private async saveUserScores(userId: number, quizSessionId: number, scores: number) {
    let userScores = await this.userScoresRepository.findOne({
      where: {
        userId: userId,
        quizSessionId: quizSessionId,
      },
    });

    if (!userScores) {
      userScores = await this.userScoresRepository.save({
        userId: userId,
        quizSessionId: quizSessionId,
        scores: 0,
      });
    }

    userScores.scores = scores;
    await this.userScoresRepository.save(userScores);
    return userScores;
  }

  private async getLeaderboardFromCache(quizSessionId: number) {
    const savedData = await this.cacheService.zrangeWithScores(`${quizSessionId}/${REDIS_KEYS.LEADERBOARD}`, 0, -1);
    if (savedData.length > 0) {
      const results = [];
      for (let i = 0; i < savedData.length; i = i + 2) {
        const userId = +savedData[i];
        const scores = +savedData[i + 1];
        results.push({
          userId: userId,
          scores,
        });
      }
      return results;
    }
  }

  private async addScoresToLeaderboard(quizSessionId: number, userId: number, scores: number) {
    await this.cacheService.zadd(`${quizSessionId}/${REDIS_KEYS.LEADERBOARD}`, scores, userId.toString());
  }

  private joinQuizSessionRoom(quizSessionId: number, socket: Socket) {
    socket.join(`${quizSessionId}`);
  }

  private async emitLeaderboardChanges(quizSessionId: number, leaderboards: any, socket: Socket) {
    socket.in(`${quizSessionId}`).emit(`${quizSessionId}/${EVENT_KEY.LEADERBOARD_CHANGES}`, leaderboards);
  }

  private async setUserDataToCache(user: User) {
    await this.cacheService.set(this.userCacheDataKey(user.id), JSON.stringify(user), 3600);
  }

  private userCacheDataKey(userId: number) {
    return `${REDIS_KEYS.USER_DATA}/${userId}`
  }
}
