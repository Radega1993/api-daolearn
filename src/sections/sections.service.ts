import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entity/section.entity';

@Injectable()
export class SectionsService {
    constructor(@InjectRepository(Section) private readonly sectionRepo: Repository<Section>) { }

    create(data: { name: string; isUnlocked: boolean; courseId: number }) {
        const section = this.sectionRepo.create(data);
        return this.sectionRepo.save(section);
    }

    findAll() {
        return this.sectionRepo.find({ relations: ['course'] });
    }

    async findOne(id: number) {
        const section = await this.sectionRepo.findOne({ where: { id }, relations: ['course'] });
        if (!section) {
            throw new NotFoundException('Section not found');
        }
        return section;
    }


    async update(id: number, data: Partial<Section>) {
        const section = await this.findOne(id);
        if (!section) throw new NotFoundException('Section not found');
        Object.assign(section, data);
        return this.sectionRepo.save(section);
    }

    async remove(id: number) {
        const section = await this.findOne(id);
        if (!section) throw new NotFoundException('Section not found');
        return this.sectionRepo.remove(section);
    }
}
