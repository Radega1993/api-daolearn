import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/course.entity';

@Injectable()
export class CoursesService {
    constructor(@InjectRepository(Course) private readonly courseRepo: Repository<Course>) { }

    create(data: { title: string; description?: string; isPublished: boolean; creatorId: number }) {
        const course = this.courseRepo.create(data);
        return this.courseRepo.save(course);
    }

    findAll() {
        return this.courseRepo.find({ relations: ['creator'] });
    }

    async findOne(id: number) {
        const course = await this.courseRepo.findOne({ where: { id }, relations: ['creator'] });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }

    async update(id: number, data: Partial<Course>) {
        const course = await this.findOne(id);
        if (!course) throw new NotFoundException('Course not found');
        Object.assign(course, data);
        return this.courseRepo.save(course);
    }

    async remove(id: number) {
        const course = await this.findOne(id);
        if (!course) throw new NotFoundException('Course not found');
        return this.courseRepo.remove(course);
    }
}
