import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserScores } from './user_scores.entity';

@Entity({ name: 'quiz_sessions' })
export class QuizSession extends BaseEntity {
	@Column({ length: 100 })
	quizId?: string;

	@OneToMany(() => UserScores, (model) => model.quizSession)
	userScores?: UserScores[];
}
