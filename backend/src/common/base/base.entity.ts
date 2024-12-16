import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity as TypeormBaseEntity,
	UpdateDateColumn
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
	@PrimaryGeneratedColumn('increment')
	id!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
