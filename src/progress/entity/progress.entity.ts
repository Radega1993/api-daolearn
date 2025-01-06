import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Section } from '../../sections/entity/section.entity';

@Entity('progress')
export class Progress {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    student: User;

    @ManyToOne(() => Section, (section) => section.id)
    section: Section;

    @Column({ default: false })
    isCompleted: boolean;

    @CreateDateColumn()
    updatedAt: Date;
}
