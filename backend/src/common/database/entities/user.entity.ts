import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserScores } from './user_scores.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
	@Column({ length: 100 })
	name?: string;

	@OneToMany(() => UserScores, (model) => model.user)
	userScores?: UserScores[];
}
