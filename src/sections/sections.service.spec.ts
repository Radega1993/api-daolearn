import { Test, TestingModule } from '@nestjs/testing';
import { SectionsService } from './sections.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Section } from './entity/section.entity';
import { NotFoundException } from '@nestjs/common';

describe('SectionsService', () => {
  let service: SectionsService;
  let repo: Repository<Section>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        {
          provide: getRepositoryToken(Section),
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

    service = module.get<SectionsService>(SectionsService);
    repo = module.get<Repository<Section>>(getRepositoryToken(Section));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a section', async () => {
      const data = { name: 'Test Section', isUnlocked: false, courseId: 1 };
      jest.spyOn(repo, 'create').mockReturnValue(data as any);
      jest.spyOn(repo, 'save').mockResolvedValue(data as any);

      const result = await service.create(data);

      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe('findAll', () => {
    it('should return all sections', async () => {
      const sections = [{ name: 'Test Section' }];
      jest.spyOn(repo, 'find').mockResolvedValue(sections as any);

      const result = await service.findAll();
      expect(result).toEqual(sections);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if section not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const section = { id: 1, name: 'Test Section' };
      jest.spyOn(service, 'findOne').mockResolvedValue(section as any);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...section, name: 'Updated Section' } as any);

      const result = await service.update(1, { name: 'Updated Section' });
      expect(result).toEqual({ ...section, name: 'Updated Section' });
    });
  });

  describe('remove', () => {
    it('should delete a section', async () => {
      const section = { id: 1, name: 'Test Section' };
      jest.spyOn(service, 'findOne').mockResolvedValue(section as any);
      jest.spyOn(repo, 'remove').mockResolvedValue(section as any);

      const result = await service.remove(1);
      expect(result).toEqual(section);
    });
  });
});
