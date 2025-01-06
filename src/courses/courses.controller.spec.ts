import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: Partial<CoursesService>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Course' }),
      findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Course' }]),
      findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Course' }),
      update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Course' }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: service }],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created course', async () => {
      const data = { title: 'Test Course', description: 'Description', isPublished: false, creatorId: 1 };
      const result = await controller.create(data);

      expect(service.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 1, title: 'Test Course' });
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, title: 'Test Course' }]);
    });
  });

  describe('findOne', () => {
    it('should return a course by ID', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, title: 'Test Course' });
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const result = await controller.update(1, { title: 'Updated Course' });

      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated Course' });
      expect(result).toEqual({ id: 1, title: 'Updated Course' });
    });
  });

  describe('remove', () => {
    it('should delete a course', async () => {
      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
