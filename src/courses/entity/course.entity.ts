import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    isPublished: boolean;

    @ManyToOne(() => User, (user) => user.id)
    creator: User;

    @CreateDateColumn()
    createdAt: Date;
}
