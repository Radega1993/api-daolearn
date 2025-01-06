import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let repo: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repo = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const data = { title: 'Test Course', isPublished: true, creatorId: 1 };
      jest.spyOn(repo, 'create').mockReturnValue(data as any);
      jest.spyOn(repo, 'save').mockResolvedValue(data as any);

      const result = await service.create(data);

      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const courses = [{ title: 'Test Course' }];
      jest.spyOn(repo, 'find').mockResolvedValue(courses as any);

      const result = await service.findAll();
      expect(result).toEqual(courses);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if course not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const course = { id: 1, title: 'Test Course' };
      jest.spyOn(service, 'findOne').mockResolvedValue(course as any);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...course, title: 'Updated' } as any);

      const result = await service.update(1, { title: 'Updated' });
      expect(result).toEqual({ ...course, title: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should delete a course', async () => {
      const course = { id: 1, title: 'Test Course' };
      jest.spyOn(service, 'findOne').mockResolvedValue(course as any);
      jest.spyOn(repo, 'remove').mockResolvedValue(course as any);

      const result = await service.remove(1);
      expect(result).toEqual(course);
    });
  });
});
