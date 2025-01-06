import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Course } from '../../courses/entity/course.entity';

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: false })
    isUnlocked: boolean;

    @ManyToOne(() => Course, (course) => course.id)
    course: Course;

    @CreateDateColumn()
    createdAt: Date;
}
