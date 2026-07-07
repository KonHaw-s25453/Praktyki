import { Test, TestingModule } from '@nestjs/testing';
import { ScreensController } from './screens.controller';
import { ScreensService } from './screens.service';
import { ScreenEntity, ScreenPlaylistEntity } from '../../entities';
import { NotFoundException } from '@nestjs/common';

describe('ScreensController', () => {
  let controller: ScreensController;
  let service: ScreensService;

  const mockScreenEntity: ScreenEntity = {
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
      screen: null as any,
      currentPlaylist: null,
    },
    fallbackFile: null,
  } as unknown as ScreenEntity;

  const mockScreenPlaylistEntity: ScreenPlaylistEntity = {
    id: 1,
    screenId: 1,
    playlistId: 1,
    priority: 1,
    activeFrom: null,
    activeTo: null,
    revision: 0,
  } as ScreenPlaylistEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreensController],
      providers: [
        {
          provide: ScreensService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockScreenEntity),
            findAll: jest.fn().mockResolvedValue([mockScreenEntity]),
            findById: jest.fn().mockResolvedValue(mockScreenEntity),
            delete: jest.fn().mockResolvedValue(undefined),
            assignPlaylistToScreen: jest.fn().mockResolvedValue(mockScreenPlaylistEntity),
            removePlaylistFromScreen: jest.fn().mockResolvedValue(undefined),
            updateAssignment: jest.fn().mockResolvedValue(mockScreenPlaylistEntity),
          },
        },
      ],
    }).compile();

    controller = module.get<ScreensController>(ScreensController);
    service = module.get<ScreensService>(ScreensService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /screens', () => {
    it('should create a new screen', async () => {
      const createScreenDto = {
        name: 'Screen 1',
        location: 'Store Front',
      };

      const result = await controller.create(createScreenDto as any);

      expect(service.create).toHaveBeenCalledWith(createScreenDto);
      expect(result).toEqual(mockScreenEntity);
    });
  });

  describe('GET /screens', () => {
    it('should return all screens', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GET /screens/:id', () => {
    it('should return a screen with playlists', async () => {
      const result = await controller.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1, true);
      expect(result).toEqual(mockScreenEntity);
    });
  });

  describe('DELETE /screens/:id', () => {
    it('should delete a screen', async () => {
      await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /screens/:id/playlists', () => {
    it('should assign a playlist to a screen', async () => {
      const assignPlaylistDto = {
        playlistId: 1,
        priority: 2,
      };

      const result = await controller.assignPlaylist(1, assignPlaylistDto as any);

      expect(service.assignPlaylistToScreen).toHaveBeenCalledWith(1, assignPlaylistDto);
      expect(result).toEqual(mockScreenPlaylistEntity);
    });
  });

  describe('DELETE /screens/:id/playlists/:playlistId', () => {
    it('should remove a playlist from a screen', async () => {
      await controller.removePlaylist(1, 1);

      expect(service.removePlaylistFromScreen).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('PUT /screens/:id/playlists/:playlistId', () => {
    it('should update playlist assignment', async () => {
      const dto = { priority: 3 };
      const result = await controller.updateAssignment(1, 1, dto as any);

      expect(service.updateAssignment).toHaveBeenCalledWith(1, 1, dto);
      expect(result).toEqual(mockScreenPlaylistEntity);
    });
  });
});
