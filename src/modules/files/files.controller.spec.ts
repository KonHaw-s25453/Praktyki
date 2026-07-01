import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileEntity } from '../../entities';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFileEntity),
            findAll: jest.fn().mockResolvedValue([mockFileEntity]),
            findById: jest.fn().mockResolvedValue(mockFileEntity),
            checkIfFileIsUsed: jest.fn().mockResolvedValue(false),
            update: jest.fn().mockResolvedValue(mockFileEntity),
            delete: jest.fn().mockResolvedValue(undefined),
            getAllVideos: jest.fn().mockResolvedValue([mockFileEntity]),
            getAllImages: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /files', () => {
    it('should create a new file', async () => {
      const createFileDto = {
        filename: 'test-video.mp4',
        originalName: 'video.mp4',
        path: '/uploads/test-video.mp4',
        mimeType: 'video/mp4',
        size: 1024000,
      };

      const result = await controller.create(createFileDto as any);

      expect(service.create).toHaveBeenCalledWith(createFileDto);
      expect(result).toEqual(mockFileEntity);
    });
  });

  describe('GET /files', () => {
    it('should return all files', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GET /files/videos', () => {
    it('should return all video files', async () => {
      const result = await controller.getAllVideos();

      expect(service.getAllVideos).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GET /files/images', () => {
    it('should return all image files', async () => {
      const result = await controller.getAllImages();

      expect(service.getAllImages).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GET /files/:id', () => {
    it('should return a file by ID', async () => {
      const result = await controller.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFileEntity);
    });
  });

  describe('GET /files/:id/used', () => {
    it('should check if file is used', async () => {
      const result = await controller.checkIfUsed(1);

      expect(service.checkIfFileIsUsed).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });

  describe('PUT /files/:id', () => {
    it('should update a file', async () => {
      const updateFileDto = { originalName: 'updated-video.mp4' };

      const result = await controller.update(1, updateFileDto as any);

      expect(service.update).toHaveBeenCalledWith(1, updateFileDto);
      expect(result).toEqual(mockFileEntity);
    });
  });

  describe('DELETE /files/:id', () => {
    it('should delete a file', async () => {
      await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
