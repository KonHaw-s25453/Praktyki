import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { BadRequestException } from '@nestjs/common';

describe('SyncController', () => {
  let controller: SyncController;
  let service: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [
        {
          provide: SyncService,
          useValue: {
            getManifestForScreen: jest.fn().mockResolvedValue({
              status: 'OK',
              revision: 1,
              manifest: { playlists: [] },
            }),
            updateScreenState: jest.fn().mockResolvedValue({ screenId: 1 }),
            recordLog: jest.fn().mockResolvedValue(undefined),
            touchScreen: jest.fn().mockResolvedValue(undefined),
            checkIfManifestChanged: jest.fn().mockResolvedValue({
              changed: false,
              currentRevision: 1,
            }),
            getFallbackAsset: jest.fn().mockResolvedValue(null),
            getScreenLogs: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<SyncController>(SyncController);
    service = module.get<SyncService>(SyncService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /sync/manifest', () => {
    it('should return manifest for screen with X-Screen-ID header', async () => {
      const req = {
        headers: {
          'x-screen-id': '1',
        },
      };
      const query = { sinceRevision: undefined };

      const result = await controller.getManifest(query as any, req);

      expect(service.getManifestForScreen).toHaveBeenCalledWith(1, undefined);
      expect(result.status).toBe('OK');
    });

    it('should return manifest with since revision', async () => {
      const req = {
        headers: {
          'x-screen-id': '1',
        },
      };
      const query = { sinceRevision: 1 };

      const result = await controller.getManifest(query as any, req);

      expect(service.getManifestForScreen).toHaveBeenCalledWith(1, 1);
    });

    it('should throw BadRequestException if X-Screen-ID header is missing', async () => {
      const req = {
        headers: {},
      };
      const query = { sinceRevision: undefined };

      await expect(controller.getManifest(query as any, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if X-Screen-ID is invalid', async () => {
      const req = {
        headers: {
          'x-screen-id': 'invalid',
        },
      };
      const query = { sinceRevision: undefined };

      await expect(controller.getManifest(query as any, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle header as array', async () => {
      const req = {
        headers: {
          'x-screen-id': ['1', '2'],
        },
      };
      const query = { sinceRevision: undefined };

      const result = await controller.getManifest(query as any, req);

      expect(service.getManifestForScreen).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe('POST /sync/:screenId/state', () => {
    it('should update screen state', async () => {
      const updateStateDto = {
        currentPlaylistId: 1,
        currentIndex: 0,
      };

      const result = await controller.updateScreenState(1, updateStateDto as any);

      expect(service.updateScreenState).toHaveBeenCalledWith(1, 1, 0);
      expect(result.screenId).toBe(1);
    });
  });

  describe('POST /sync/:screenId/logs', () => {
    it('should record a log from screen', async () => {
      const recordLogDto = {
        message: 'Test log message',
        level: 'INFO' as const,
      };

      await controller.recordLog(1, recordLogDto as any);

      expect(service.recordLog).toHaveBeenCalledWith(1, 'Test log message', 'INFO');
    });

    it('should record error log', async () => {
      const recordLogDto = {
        message: 'Error occurred',
        level: 'ERROR' as const,
      };

      await controller.recordLog(1, recordLogDto as any);

      expect(service.recordLog).toHaveBeenCalledWith(1, 'Error occurred', 'ERROR');
    });
  });

  describe('POST /sync/:screenId/heartbeat', () => {
    it('should touch screen', async () => {
      await controller.heartbeat(1);

      expect(service.touchScreen).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /sync/:screenId/check', () => {
    it('should check if manifest changed', async () => {
      const result = await controller.checkManifestChanged(1, 1);

      expect(service.checkIfManifestChanged).toHaveBeenCalledWith(1, 1);
      expect(result.changed).toBe(false);
      expect(result.currentRevision).toBe(1);
    });

    it('should report manifest as changed when revision differs', async () => {
      (service.checkIfManifestChanged as jest.Mock).mockResolvedValue({
        changed: true,
        currentRevision: 2,
      });

      const result = await controller.checkManifestChanged(1, 1);

      expect(result.changed).toBe(true);
    });
  });

  describe('GET /sync/:screenId/fallback', () => {
    it('should return fallback asset for screen', async () => {
      const fallbackAsset = {
        id: 1,
        filename: 'fallback.mp4',
        path: '/fallback.mp4',
      };
      (service.getFallbackAsset as jest.Mock).mockResolvedValue(fallbackAsset);

      const result = await controller.getFallback(1);

      expect(service.getFallbackAsset).toHaveBeenCalledWith(1);
      expect(result).toEqual(fallbackAsset);
    });

    it('should return null if no fallback asset', async () => {
      const result = await controller.getFallback(1);

      expect(service.getFallbackAsset).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('GET /sync/:screenId/logs', () => {
    it('should return screen logs', async () => {
      const mockLogs = [
        { id: 1, message: 'Log 1' },
        { id: 2, message: 'Log 2' },
      ];
      (service.getScreenLogs as jest.Mock).mockResolvedValue(mockLogs);

      const result = await controller.getLogs(1);

      expect(service.getScreenLogs).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLogs);
    });
  });
});
