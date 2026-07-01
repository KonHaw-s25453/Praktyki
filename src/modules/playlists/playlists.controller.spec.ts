import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { PlaylistEntity, PlaylistItemEntity } from '../../entities';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
  let service: PlaylistsService;

  const mockPlaylistEntity: PlaylistEntity = {
    id: 1,
    name: 'Test Playlist',
    description: 'A test playlist',
    createdAt: new Date(),
    updatedAt: new Date(),
    revision: 1,
    items: [],
    screenPlaylists: [],
    screenStates: [],
  } as unknown as PlaylistEntity;

  const mockPlaylistItemEntity: PlaylistItemEntity = {
    id: 1,
    playlistId: 1,
    fileId: 1,
    position: 0,
    duration: 30,
  } as PlaylistItemEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [
        {
          provide: PlaylistsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPlaylistEntity),
            findAll: jest.fn().mockResolvedValue([mockPlaylistEntity]),
            findById: jest.fn().mockResolvedValue(mockPlaylistEntity),
            update: jest.fn().mockResolvedValue(mockPlaylistEntity),
            delete: jest.fn().mockResolvedValue(undefined),
            addItemToPlaylist: jest.fn().mockResolvedValue(mockPlaylistItemEntity),
            removeItemFromPlaylist: jest.fn().mockResolvedValue(undefined),
            reorderItems: jest.fn().mockResolvedValue(undefined),
            getPlaylistRevision: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /playlists', () => {
    it('should create a new playlist', async () => {
      const createPlaylistDto = {
        name: 'Test Playlist',
        description: 'A test playlist',
      };

      const result = await controller.create(createPlaylistDto as any);

      expect(service.create).toHaveBeenCalledWith(createPlaylistDto);
      expect(result).toEqual(mockPlaylistEntity);
    });
  });

  describe('GET /playlists', () => {
    it('should return all playlists', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GET /playlists/:id', () => {
    it('should return a playlist by ID', async () => {
      const result = await controller.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlaylistEntity);
    });
  });

  describe('PUT /playlists/:id', () => {
    it('should update a playlist', async () => {
      const updatePlaylistDto = { name: 'Updated Playlist' };

      const result = await controller.update(1, updatePlaylistDto as any);

      expect(service.update).toHaveBeenCalledWith(1, updatePlaylistDto);
      expect(result).toEqual(mockPlaylistEntity);
    });
  });

  describe('DELETE /playlists/:id', () => {
    it('should delete a playlist', async () => {
      await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /playlists/:id/items', () => {
    it('should add an item to a playlist', async () => {
      const addItemDto = {
        fileId: 1,
        position: 0,
        duration: 30,
      };

      const result = await controller.addItem(1, addItemDto as any);

      expect(service.addItemToPlaylist).toHaveBeenCalledWith(1, addItemDto);
      expect(result).toEqual(mockPlaylistItemEntity);
    });
  });

  describe('DELETE /playlists/:id/items/:itemId', () => {
    it('should remove an item from a playlist', async () => {
      await controller.removeItem(1, 1);

      expect(service.removeItemFromPlaylist).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('PUT /playlists/:id/reorder', () => {
    it('should reorder playlist items', async () => {
      const reorderDto = {
        itemIds: [1, 2, 3],
      };

      await controller.reorderItems(1, reorderDto as any);

      expect(service.reorderItems).toHaveBeenCalledWith(1, reorderDto);
    });
  });

  describe('GET /playlists/:id/revision', () => {
    it('should get the revision number of a playlist', async () => {
      const result = await controller.getRevision(1);

      expect(service.getPlaylistRevision).toHaveBeenCalledWith(1);
      expect(result).toBe(1);
    });
  });
});
