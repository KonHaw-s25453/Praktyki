import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileRepository } from '../../repositories';
import { FileEntity } from '../../entities';

describe('FilesService', () => {
  let service: FilesService;
  let mockFileRepository: Partial<FileRepository>;

  const mockFileEntity: FileEntity = {
    id: 1,
    filename: 'test-video.mp4',
    originalName: 'video.mp4',
    path: '/uploads/test-video.mp4',
    mimeType: 'video/mp4',
    size: 1024000,
    duration: 120,
    checksum: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    playlistItems: [],
    screenAsFallback: null,
  } as unknown as FileEntity;

  beforeEach(async () => {
    mockFileRepository = {
      create: jest.fn().mockReturnValue(mockFileEntity),
      save: jest.fn().mockResolvedValue(mockFileEntity),
      find: jest.fn().mockResolvedValue([mockFileEntity]),
      findOne: jest.fn().mockResolvedValue(mockFileEntity),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockFileEntity),
      }),
      findByChecksum: jest.fn().mockResolvedValue(mockFileEntity),
      findByMimeType: jest.fn().mockResolvedValue([mockFileEntity]),
      findAllVideos: jest.fn().mockResolvedValue([mockFileEntity]),
      findAllImages: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FileRepository,
          useValue: mockFileRepository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a file', async () => {
      const createFileDto = {
        filename: 'test-video.mp4',
        originalName: 'video.mp4',
        path: '/uploads/test-video.mp4',
        mimeType: 'video/mp4',
        size: 1024000,
      };

      const result = await service.create(createFileDto as any);

      expect(mockFileRepository.create).toHaveBeenCalledWith(createFileDto);
      expect(mockFileRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockFileEntity);
    });
  });

  describe('findAll', () => {
    it('should return an array of files ordered by creation date', async () => {
      const result = await service.findAll();

      expect(mockFileRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(mockFileEntity);
    });
  });

  describe('findById', () => {
    it('should return a file by ID with its playlist items', async () => {
      const result = await service.findById(1);

      expect(result).toEqual(mockFileEntity);
      expect(mockFileRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw NotFoundException when file does not exist', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByChecksum', () => {
    it('should find a file by checksum', async () => {
      const checksum = 'abc123';
      const result = await service.findByChecksum(checksum);

      expect(mockFileRepository.findByChecksum).toHaveBeenCalledWith(checksum);
      expect(result).toEqual(mockFileEntity);
    });
  });

  describe('checkIfFileIsUsed', () => {
    it('should return true if file is used in playlists', async () => {
      const fileWithItems = {
        ...mockFileEntity,
        playlistItems: [{ id: 1 }, { id: 2 }],
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(fileWithItems),
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.checkIfFileIsUsed(1);

      expect(result).toBe(true);
    });

    it('should return false if file is not used', async () => {
      const fileWithoutItems = {
        ...mockFileEntity,
        playlistItems: [],
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(fileWithoutItems),
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.checkIfFileIsUsed(1);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update a file and return updated data', async () => {
      const updateFileDto = { originalName: 'updated-video.mp4' };
      const updatedFile = { ...mockFileEntity, ...updateFileDto };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockFileEntity),
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      (mockFileRepository.findOne as jest.Mock).mockResolvedValue(mockFileEntity);

      mockQueryBuilder.getOne = jest.fn()
        .mockResolvedValueOnce(mockFileEntity) // First call in findById
        .mockResolvedValueOnce(updatedFile); // Second call after update

      const result = await service.update(1, updateFileDto as any);

      expect(mockFileRepository.update).toHaveBeenCalledWith(1, updateFileDto);
      expect(result).toEqual(updatedFile);
    });
  });

  describe('delete', () => {
    it('should delete a file that is not used', async () => {
      const fileWithoutItems = {
        ...mockFileEntity,
        playlistItems: [],
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn()
          .mockResolvedValueOnce(fileWithoutItems) // findById
          .mockResolvedValueOnce(fileWithoutItems), // checkIfFileIsUsed
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await service.delete(1);

      expect(mockFileRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ConflictException when file is used in playlists', async () => {
      const fileWithItems = {
        ...mockFileEntity,
        playlistItems: [{ id: 1 }],
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(fileWithItems),
      };
      (mockFileRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(service.delete(1)).rejects.toThrow(ConflictException);
      expect(mockFileRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getFilesByMimeType', () => {
    it('should return files filtered by MIME type', async () => {
      const result = await service.getFilesByMimeType('video/mp4');

      expect(mockFileRepository.findByMimeType).toHaveBeenCalledWith('video/mp4');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAllVideos', () => {
    it('should return all video files', async () => {
      const result = await service.getAllVideos();

      expect(mockFileRepository.findAllVideos).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAllImages', () => {
    it('should return all image files', async () => {
      const result = await service.getAllImages();

      expect(mockFileRepository.findAllImages).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
