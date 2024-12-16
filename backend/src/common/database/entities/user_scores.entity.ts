import { Column, Entity, ManyToOne } from 'typeorm';
import { QuizSession } from './quiz_session.entity';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity({ name: 'user_scores' })
export class UserScores extends BaseEntity {
	@Column()
	public userId!: number;

	@Column()
	public quizSessionId!: number;

	@ManyToOne(() => User, (user) => user.userScores)
	public user?: User;

	@ManyToOne(() => QuizSession, (quizSession) => quizSession.userScores)
	public quizSession?: QuizSession;

	@Column()
	public scores!: number;
}
