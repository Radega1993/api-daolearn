import { Test, TestingModule } from '@nestjs/testing';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

describe('SectionsController', () => {
  let controller: SectionsController;
  let service: Partial<SectionsService>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Section' }),
      findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Section' }]),
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Section' }),
      update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Section' }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionsController],
      providers: [{ provide: SectionsService, useValue: service }],
    }).compile();

    controller = module.get<SectionsController>(SectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created section', async () => {
      const data = { name: 'Test Section', isUnlocked: false, courseId: 1 };
      const result = await controller.create(data);

      expect(service.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 1, name: 'Test Section' });
    });
  });

  describe('findAll', () => {
    it('should return all sections', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, name: 'Test Section' }]);
    });
  });

  describe('findOne', () => {
    it('should return a section by ID', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'Test Section' });
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const result = await controller.update(1, { name: 'Updated Section' });

      expect(service.update).toHaveBeenCalledWith(1, { name: 'Updated Section' });
      expect(result).toEqual({ id: 1, name: 'Updated Section' });
    });
  });

  describe('remove', () => {
    it('should delete a section', async () => {
      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
