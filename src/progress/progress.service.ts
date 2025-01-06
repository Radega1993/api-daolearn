import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entity/progress.entity';

@Injectable()
export class ProgressService {
  constructor(@InjectRepository(Progress) private readonly progressRepo: Repository<Progress>) { }

  create(data: { studentId: number; sectionId: number; isCompleted: boolean }) {
    const progress = this.progressRepo.create(data);
    return this.progressRepo.save(progress);
  }

  findByStudent(studentId: number) {
    return this.progressRepo.find({
      where: { student: { id: studentId } },
      relations: ['section'],
    });
  }

  async unlockSection(data: { sectionId: number; studentId: number }) {
    const progress = await this.progressRepo.findOne({
      where: { section: { id: data.sectionId }, student: { id: data.studentId } },
    });

    if (progress) {
      progress.isCompleted = true;
      return this.progressRepo.save(progress);
    }

    const newProgress = this.progressRepo.create({ section: { id: data.sectionId }, student: { id: data.studentId }, isCompleted: true });
    return this.progressRepo.save(newProgress);
  }
}
