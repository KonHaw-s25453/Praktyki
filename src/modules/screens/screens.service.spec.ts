import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ScreensService } from './screens.service';
import {
  ScreenRepository,
  ScreenPlaylistRepository,
  FileRepository,
} from '../../repositories';
import { ScreenEntity, ScreenPlaylistEntity } from '../../entities';

describe('ScreensService', () => {
  let service: ScreensService;
  let mockScreenRepository: any;
  let mockScreenPlaylistRepository: any;
  let mockFileRepository: any;

  const mockScreenEntity = {
    id: 1,
    name: 'Screen 1',
    location: 'Store Front',
    apiKey: 'test-api-key-123',
    fallbackFileId: null,
    createdAt: new Date(),
    lastSeen: new Date(),
    screenPlaylists: [],
    logs: [],
    state: {
      screenId: 1,
      lastSync: null,
      lastPlaylistHash: null,
      currentPlaylistId: null,
      currentIndex: 0,
      updatedAt: new Date(),
      screen: null,
      currentPlaylist: null,
    },
    fallbackFile: null,
  } as unknown as ScreenEntity;

  const mockScreenPlaylistEntity = {
    id: 1,
    screenId: 1,
    playlistId: 1,
    priority: 1,
    activeFrom: null,
    activeTo: null,
    revision: 0,
  } as ScreenPlaylistEntity;

  beforeEach(async () => {
    mockScreenRepository = {
      create: jest.fn().mockReturnValue(mockScreenEntity),
      save: jest.fn().mockResolvedValue(mockScreenEntity),
      find: jest.fn().mockResolvedValue([mockScreenEntity]),
      findOne: jest.fn().mockResolvedValue(mockScreenEntity),
      findAllWithState: jest.fn().mockResolvedValue([mockScreenEntity]),
      findWithPlaylists: jest.fn().mockResolvedValue(mockScreenEntity),
      findByApiKey: jest.fn().mockResolvedValue(mockScreenEntity),
      findByLocation: jest.fn().mockResolvedValue([mockScreenEntity]),
      updateLastSeen: jest.fn(),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockScreenPlaylistRepository = {
      create: jest.fn().mockReturnValue(mockScreenPlaylistEntity),
      save: jest.fn().mockResolvedValue(mockScreenPlaylistEntity),
      findOne: jest.fn().mockResolvedValue(mockScreenPlaylistEntity),
      findByScreenAndPlaylist: jest.fn(),
      findActiveByScreenId: jest.fn().mockResolvedValue([mockScreenPlaylistEntity]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn(),
    };

    mockFileRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScreensService,
        { provide: ScreenRepository, useValue: mockScreenRepository },
        { provide: ScreenPlaylistRepository, useValue: mockScreenPlaylistRepository },
        { provide: FileRepository, useValue: mockFileRepository },
      ],
    }).compile();

    service = module.get<ScreensService>(ScreensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create a new screen', async () => {
      const dto = { name: 'Screen 1', location: 'Store Front' };

      const result = await service.create(dto as any);

      expect(mockScreenRepository.create).toHaveBeenCalled();
      expect(mockScreenRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockScreenEntity);
    });
  });

  // ---------------- FIND ----------------
  describe('findById', () => {
    it('should return screen', async () => {
      const result = await service.findById(1);

      expect(mockScreenRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockScreenEntity);
    });

    it('should throw if not found', async () => {
      mockScreenRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- REMOVE SCREEN ----------------
  describe('delete', () => {
    it('should delete screen', async () => {
      await service.delete(1);

      expect(mockScreenRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  // ---------------- ASSIGN ----------------
  describe('assignPlaylistToScreen', () => {
    it('should assign playlist', async () => {
      mockScreenPlaylistRepository.findByScreenAndPlaylist.mockResolvedValue(null);

      const dto = { playlistId: 1, priority: 2 };

      const result = await service.assignPlaylistToScreen(1, dto as any);

      expect(mockScreenPlaylistRepository.create).toHaveBeenCalled();
      expect(mockScreenPlaylistRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockScreenPlaylistEntity);
    });

    it('should throw conflict', async () => {
      mockScreenPlaylistRepository.findByScreenAndPlaylist.mockResolvedValue(
        mockScreenPlaylistEntity,
      );

      await expect(
        service.assignPlaylistToScreen(1, { playlistId: 1, priority: 2 } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ---------------- REMOVE PLAYLIST ----------------
  describe('removePlaylistFromScreen', () => {
    it('should remove assignment', async () => {
      mockScreenPlaylistRepository.findByScreenAndPlaylist.mockResolvedValue(
        mockScreenPlaylistEntity,
      );

      await service.removePlaylistFromScreen(1, 1);

      expect(mockScreenPlaylistRepository.findByScreenAndPlaylist)
        .toHaveBeenCalledWith(1, 1);

      expect(mockScreenPlaylistRepository.delete)
        .toHaveBeenCalledWith(mockScreenPlaylistEntity.id);
    });

    it('should throw if not exists', async () => {
      mockScreenPlaylistRepository.findByScreenAndPlaylist.mockResolvedValue(null);

      await expect(service.removePlaylistFromScreen(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------------- UPDATE ASSIGNMENT ----------------
  describe('updateAssignment', () => {
    it('should update priority', async () => {
      mockScreenPlaylistRepository.findByScreenAndPlaylist.mockResolvedValue(
        mockScreenPlaylistEntity,
      );

      mockScreenPlaylistRepository.findOne.mockResolvedValue({
        ...mockScreenPlaylistEntity,
        priority: 3,
      });

      const dto = { priority: 3 };
      const result = await service.updateAssignment(1, 1, dto);

      expect(mockScreenPlaylistRepository.update).toHaveBeenCalledWith(
        mockScreenPlaylistEntity.id,
        expect.objectContaining({ priority: 3 }),
      );

      expect(result.priority).toBe(3);
    });
  });
});