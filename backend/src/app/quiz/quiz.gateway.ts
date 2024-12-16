import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EVENT_KEY } from 'src/common/constants';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { JoinQuizSessionDto } from './dto/join-quiz.dto';
import { SubmitQuizSessionDto } from './dto/submit-quiz.dto';
import { QuizService } from './quiz.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuizsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private quizService: QuizService,
  ) { }

  @SubscribeMessage(EVENT_KEY.JOIN_QUIZ_SESSION)
  async joinQuizSession(@MessageBody() data: JoinQuizSessionDto, @ConnectedSocket() socket: Socket) {
    return this.quizService.joinQuizSession(data, socket);
  }

  @SubscribeMessage(EVENT_KEY.SUBMIT_QUIZ_ANSWERS)
  async submitQuizAnswer(@MessageBody() data: SubmitQuizSessionDto, @ConnectedSocket() socket: Socket) {
    return this.quizService.submitQuizAnswer(data, socket);
  }

  @SubscribeMessage(EVENT_KEY.GET_LEADERBOARD)
  async getLeaderboard(@MessageBody() data: GetLeaderboardDto) {
    return this.quizService.getLeaderboard(data);
  }

  @SubscribeMessage(EVENT_KEY.GET_QUIZ_QUESTIONS)
  async getQuizQuestions() {
    return this.quizService.getQuizQuestions();
  }
}