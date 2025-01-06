import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

describe('ProgressController', () => {
  let controller: ProgressController;
  let service: Partial<ProgressService>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ studentId: 1, sectionId: 2, isCompleted: true }),
      findByStudent: jest.fn().mockResolvedValue([{ studentId: 1, sectionId: 2, isCompleted: true }]),
      unlockSection: jest.fn().mockResolvedValue({ studentId: 1, sectionId: 2, isCompleted: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [{ provide: ProgressService, useValue: service }],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created progress', async () => {
      const data = { studentId: 1, sectionId: 2, isCompleted: true };
      const result = await controller.create(data);

      expect(service.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ studentId: 1, sectionId: 2, isCompleted: true });
    });
  });

  describe('findByStudent', () => {
    it('should return progress entries for a student', async () => {
      const result = await controller.findByStudent(1);

      expect(service.findByStudent).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ studentId: 1, sectionId: 2, isCompleted: true }]);
    });
  });

  describe('unlockSection', () => {
    it('should unlock a section for a student', async () => {
      const data = { studentId: 1, sectionId: 2 };
      const result = await controller.unlockSection(data);

      expect(service.unlockSection).toHaveBeenCalledWith(data);
      expect(result).toEqual({ studentId: 1, sectionId: 2, isCompleted: true });
    });
  });
});
