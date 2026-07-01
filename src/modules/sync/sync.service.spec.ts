import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SyncService } from './sync.service';
import {
  ScreenRepository,
  CacheManifestRepository,
  ScreenStateRepository,
  ScreenLogRepository,
  ScreenPlaylistRepository,
  PlaylistRepository,
  PlaylistItemRepository,
  FileRepository,
} from '../../repositories';
import { CacheManifestEntity, ScreenStateEntity } from '../../entities';

describe('SyncService', () => {
  let service: SyncService;
  let mockScreenRepository: Partial<ScreenRepository>;
  let mockCacheManifestRepository: Partial<CacheManifestRepository>;
  let mockScreenStateRepository: Partial<ScreenStateRepository>;
  let mockScreenLogRepository: Partial<ScreenLogRepository>;
  let mockScreenPlaylistRepository: Partial<ScreenPlaylistRepository>;
  let mockPlaylistRepository: Partial<PlaylistRepository>;
  let mockPlaylistItemRepository: Partial<PlaylistItemRepository>;
  let mockFileRepository: Partial<FileRepository>;

  const mockCacheManifestEntity: CacheManifestEntity = {
    id: 1,
    screenId: 1,
    revision: 1,
    manifest: {
      screenId: 1,
      timestamp: '2024-01-01T00:00:00Z',
      playlists: [],
      fallback: null,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    screen: null as any,
  } as unknown as CacheManifestEntity;

  beforeEach(async () => {
    mockScreenRepository = {
      findWithPlaylists: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Test Screen',
        fallbackFile: null,
      }),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Test Screen',
        fallbackFile: null,
      }),
      updateLastSeen: jest.fn().mockResolvedValue(undefined),
    };

    mockCacheManifestRepository = {
      findByScreenId: jest.fn().mockResolvedValue(mockCacheManifestEntity),
      upsertManifest: jest.fn().mockResolvedValue(mockCacheManifestEntity),
      deleteByScreenId: jest.fn().mockResolvedValue(undefined),
    };

    mockScreenStateRepository = {
      updateCurrentPlayback: jest.fn().mockResolvedValue(undefined),
      findByScreenId: jest.fn().mockResolvedValue({
        id: 1,
        screenId: 1,
        currentPlaylistId: 1,
        currentIndex: 0,
        lastSync: null,
        lastPlaylistHash: null,
        updatedAt: new Date(),
        screen: null as any,
        currentPlaylist: null,
      } as unknown as ScreenStateEntity),
    };

    mockScreenLogRepository = {
      save: jest.fn().mockResolvedValue({}),
      findByScreenId: jest.fn().mockResolvedValue([]),
    };

    mockScreenPlaylistRepository = {
      findActiveByScreenId: jest.fn().mockResolvedValue([]),
    };

    mockPlaylistRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    mockPlaylistItemRepository = {
      findByPlaylistId: jest.fn().mockResolvedValue([]),
    };

    mockFileRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        {
          provide: ScreenRepository,
          useValue: mockScreenRepository,
        },
        {
          provide: CacheManifestRepository,
          useValue: mockCacheManifestRepository,
        },
        {
          provide: ScreenStateRepository,
          useValue: mockScreenStateRepository,
        },
        {
          provide: ScreenLogRepository,
          useValue: mockScreenLogRepository,
        },
        {
          provide: ScreenPlaylistRepository,
          useValue: mockScreenPlaylistRepository,
        },
        {
          provide: PlaylistRepository,
          useValue: mockPlaylistRepository,
        },
        {
          provide: PlaylistItemRepository,
          useValue: mockPlaylistItemRepository,
        },
        {
          provide: FileRepository,
          useValue: mockFileRepository,
        },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getManifestForScreen', () => {
    it('should return manifest with status OK', async () => {
      const result = await service.getManifestForScreen(1);

      expect(result.status).toBe('OK');
      expect(result.revision).toBe(1);
      expect(result.manifest).toBeDefined();
      expect(mockScreenRepository.updateLastSeen).toHaveBeenCalledWith(1);
    });

    it('should return NOT_CHANGED status when client has current revision', async () => {
      const result = await service.getManifestForScreen(1, 1);

      expect(result.status).toBe('NOT_CHANGED');
      expect(result.manifest).toEqual({});
    });

    it('should regenerate manifest if not cached', async () => {
      (mockCacheManifestRepository.findByScreenId as jest.Mock).mockResolvedValue(null);

      const result = await service.getManifestForScreen(1);

      expect(mockCacheManifestRepository.upsertManifest).toHaveBeenCalled();
      expect(result.status).toBe('OK');
    });

    it('should throw NotFoundException if screen not found', async () => {
      (mockScreenRepository.findWithPlaylists as jest.Mock).mockResolvedValue(null);

      await expect(service.getManifestForScreen(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('regenerateManifestForScreen', () => {
    it('should regenerate and cache manifest', async () => {
      (mockScreenPlaylistRepository.findActiveByScreenId as jest.Mock).mockResolvedValue([]);

      const result = await service.regenerateManifestForScreen(1);

      expect(mockCacheManifestRepository.upsertManifest).toHaveBeenCalled();
      expect(result).toEqual(mockCacheManifestEntity);
    });

    it('should throw NotFoundException if screen not found', async () => {
      (mockScreenRepository.findWithPlaylists as jest.Mock).mockResolvedValue(null);

      await expect(service.regenerateManifestForScreen(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateScreenState', () => {
    it('should update screen state and return it', async () => {
      const result = await service.updateScreenState(1, 1, 0);

      expect(mockScreenStateRepository.updateCurrentPlayback).toHaveBeenCalledWith(1, 1, 0);
      expect(result).toBeDefined();
      expect(result?.screenId).toBe(1);
    });
  });

  describe('touchScreen', () => {
    it('should update lastSeen timestamp', async () => {
      await service.touchScreen(1);

      expect(mockScreenRepository.updateLastSeen).toHaveBeenCalledWith(1);
    });
  });

  describe('recordLog', () => {
    it('should record a log message with default level', async () => {
      await service.recordLog(1, 'Test message');

      expect(mockScreenLogRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          screenId: 1,
          message: 'Test message',
          level: 'INFO',
        }),
      );
    });

    it('should record a log message with specific level', async () => {
      await service.recordLog(1, 'Error occurred', 'ERROR');

      expect(mockScreenLogRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          screenId: 1,
          message: 'Error occurred',
          level: 'ERROR',
        }),
      );
    });

    it('should throw NotFoundException if screen not found', async () => {
      (mockScreenRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.recordLog(999, 'Test')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFallbackAsset', () => {
    it('should return fallback asset if available', async () => {
      const fallbackFile = {
        id: 1,
        filename: 'fallback.mp4',
        path: '/fallback.mp4',
        mimeType: 'video/mp4',
        duration: 30,
        size: 5000,
        checksum: 'abc123',
      };
      (mockScreenRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Screen',
        fallbackFile,
      });

      const result = await service.getFallbackAsset(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.filename).toBe('fallback.mp4');
    });

    it('should return null if no fallback file', async () => {
      (mockScreenRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Screen',
        fallbackFile: null,
      });

      const result = await service.getFallbackAsset(1);

      expect(result).toBeNull();
    });

    it('should throw NotFoundException if screen not found', async () => {
      (mockScreenRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getFallbackAsset(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkIfManifestChanged', () => {
    it('should return changed=false if revision matches', async () => {
      const result = await service.checkIfManifestChanged(1, 1);

      expect(result.changed).toBe(false);
      expect(result.currentRevision).toBe(1);
    });

    it('should return changed=true if revision differs', async () => {
      const result = await service.checkIfManifestChanged(1, 0);

      expect(result.changed).toBe(true);
      expect(result.currentRevision).toBe(1);
    });

    it('should return changed=true if no cached manifest', async () => {
      (mockCacheManifestRepository.findByScreenId as jest.Mock).mockResolvedValue(null);

      const result = await service.checkIfManifestChanged(1, 0);

      expect(result.changed).toBe(true);
      expect(result.currentRevision).toBe(0);
    });
  });

  describe('invalidateCache', () => {
    it('should delete cache for screen', async () => {
      await service.invalidateCache(1);

      expect(mockCacheManifestRepository.deleteByScreenId).toHaveBeenCalledWith(1);
    });
  });

  describe('getScreenLogs', () => {
    it('should return recent logs with default limit', async () => {
      const mockLogs = [
        { id: 1, message: 'Log 1' },
        { id: 2, message: 'Log 2' },
      ];
      (mockScreenLogRepository.findByScreenId as jest.Mock).mockResolvedValue(mockLogs);

      const result = await service.getScreenLogs(1);

      expect(mockScreenLogRepository.findByScreenId).toHaveBeenCalledWith(1, 100);
      expect(result).toEqual(mockLogs);
    });

    it('should return recent logs with custom limit', async () => {
      const mockLogs = [{ id: 1, message: 'Log 1' }];
      (mockScreenLogRepository.findByScreenId as jest.Mock).mockResolvedValue(mockLogs);

      const result = await service.getScreenLogs(1, 50);

      expect(mockScreenLogRepository.findByScreenId).toHaveBeenCalledWith(1, 50);
      expect(result).toEqual(mockLogs);
    });
  });
});
