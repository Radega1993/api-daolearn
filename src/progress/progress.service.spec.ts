import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Progress } from './entity/progress.entity';

describe('ProgressService', () => {
  let service: ProgressService;
  let repo: Repository<Progress>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(Progress),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    repo = module.get<Repository<Progress>>(getRepositoryToken(Progress));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a progress entry', async () => {
      const data = { studentId: 1, sectionId: 2, isCompleted: true };
      jest.spyOn(repo, 'create').mockReturnValue(data as any);
      jest.spyOn(repo, 'save').mockResolvedValue(data as any);

      const result = await service.create(data);

      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe('unlockSection', () => {
    it('should create a new progress entry if none exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue({
        student: { id: 1 },
        section: { id: 2 },
        isCompleted: true,
      } as any);
      jest.spyOn(repo, 'save').mockResolvedValue({
        student: { id: 1 },
        section: { id: 2 },
        isCompleted: true,
      } as any);

      const result = await service.unlockSection({ studentId: 1, sectionId: 2 });

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { section: { id: 2 }, student: { id: 1 } },
      });
      expect(repo.create).toHaveBeenCalledWith({
        student: { id: 1 },
        section: { id: 2 },
        isCompleted: true,
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({
        student: { id: 1 },
        section: { id: 2 },
        isCompleted: true,
      });
    });
  });
});