import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistRepository, PlaylistItemRepository, FileRepository } from '../../repositories';
import { PlaylistEntity, PlaylistItemEntity } from '../../entities';

describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let mockPlaylistRepository: Partial<PlaylistRepository>;
  let mockPlaylistItemRepository: Partial<PlaylistItemRepository>;
  let mockFileRepository: Partial<FileRepository>;

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
    mockPlaylistRepository = {
      create: jest.fn().mockReturnValue(mockPlaylistEntity),
      save: jest.fn().mockResolvedValue(mockPlaylistEntity),
      find: jest.fn().mockResolvedValue([mockPlaylistEntity]),
      findOne: jest.fn().mockResolvedValue(mockPlaylistEntity),
      findAllWithItems: jest.fn().mockResolvedValue([mockPlaylistEntity]),
      findWithItems: jest.fn().mockResolvedValue(mockPlaylistEntity),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockPlaylistItemRepository = {
      create: jest.fn().mockReturnValue(mockPlaylistItemEntity),
      save: jest.fn().mockResolvedValue(mockPlaylistItemEntity),
      findOne: jest.fn().mockResolvedValue(mockPlaylistItemEntity),
      findByPlaylistId: jest.fn().mockResolvedValue([mockPlaylistItemEntity]),
      findByPlaylistIdAndPosition: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockFileRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 1, filename: 'test.mp4' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
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

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new playlist', async () => {
      const createPlaylistDto = {
        name: 'Test Playlist',
        description: 'A test playlist',
      };

      const result = await service.create(createPlaylistDto as any);

      expect(mockPlaylistRepository.create).toHaveBeenCalledWith(createPlaylistDto);
      expect(mockPlaylistRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPlaylistEntity);
    });
  });

  describe('findAll', () => {
    it('should return all playlists with their items', async () => {
      const result = await service.findAll();

      expect(mockPlaylistRepository.findAllWithItems).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(mockPlaylistEntity);
    });
  });

  describe('findById', () => {
    it('should return a playlist by ID with its items', async () => {
      const result = await service.findById(1);

      expect(mockPlaylistRepository.findWithItems).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlaylistEntity);
    });

    it('should throw NotFoundException when playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a playlist', async () => {
      const updatePlaylistDto = { name: 'Updated Playlist' };

      const result = await service.update(1, updatePlaylistDto as any);

      expect(mockPlaylistRepository.update).toHaveBeenCalledWith(1, updatePlaylistDto);
      expect(result).toEqual(mockPlaylistEntity);
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a playlist', async () => {
      await service.delete(1);

      expect(mockPlaylistRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addItemToPlaylist', () => {
    it('should add an item to a playlist', async () => {
      const addItemDto = {
        fileId: 1,
        position: 0,
        duration: 30,
      };

      const result = await service.addItemToPlaylist(1, addItemDto as any);

      expect(mockPlaylistItemRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          playlistId: 1,
          fileId: 1,
          position: 0,
          duration: 30,
        }),
      );
      expect(mockPlaylistItemRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPlaylistItemEntity);
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      const addItemDto = {
        fileId: 1,
        position: 0,
        duration: 30,
      };

      await expect(service.addItemToPlaylist(999, addItemDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if file does not exist', async () => {
      (mockFileRepository.findOne as jest.Mock).mockResolvedValue(null);

      const addItemDto = {
        fileId: 999,
        position: 0,
        duration: 30,
      };

      await expect(service.addItemToPlaylist(1, addItemDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if item at position already exists', async () => {
      (mockPlaylistItemRepository.findByPlaylistIdAndPosition as jest.Mock).mockResolvedValue(
        mockPlaylistItemEntity,
      );

      const addItemDto = {
        fileId: 1,
        position: 0,
        duration: 30,
      };

      await expect(service.addItemToPlaylist(1, addItemDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeItemFromPlaylist', () => {
    it('should remove an item from a playlist', async () => {
      await service.removeItemFromPlaylist(1, 1);

      expect(mockPlaylistItemRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      await expect(service.removeItemFromPlaylist(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if item does not exist in playlist', async () => {
      (mockPlaylistItemRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeItemFromPlaylist(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorderItems', () => {
    it('should reorder playlist items', async () => {
      const item1 = { id: 1, playlistId: 1, position: 0 };
      const item2 = { id: 2, playlistId: 1, position: 1 };
      (mockPlaylistItemRepository.findByPlaylistId as jest.Mock).mockResolvedValue([
        item1,
        item2,
      ]);

      const reorderDto = {
        itemIds: [2, 1],
      };

      await service.reorderItems(1, reorderDto as any);

      expect(mockPlaylistItemRepository.update).toHaveBeenCalledWith(2, { position: 0 });
      expect(mockPlaylistItemRepository.update).toHaveBeenCalledWith(1, { position: 1 });
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findWithItems as jest.Mock).mockResolvedValue(null);

      await expect(service.reorderItems(999, { itemIds: [] } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if item count mismatch', async () => {
      (mockPlaylistItemRepository.findByPlaylistId as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const reorderDto = {
        itemIds: [1], // Only 1 item instead of 2
      };

      await expect(service.reorderItems(1, reorderDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if item not found', async () => {
      (mockPlaylistItemRepository.findByPlaylistId as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const reorderDto = {
        itemIds: [1, 999], // 999 does not exist
      };

      await expect(service.reorderItems(1, reorderDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPlaylistRevision', () => {
    it('should return the revision number of a playlist', async () => {
      const result = await service.getPlaylistRevision(1);

      expect(mockPlaylistRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });

    it('should return 0 if revision is not set', async () => {
      const playlistWithoutRevision = { ...mockPlaylistEntity, revision: undefined };
      (mockPlaylistRepository.findOne as jest.Mock).mockResolvedValue(playlistWithoutRevision);

      const result = await service.getPlaylistRevision(1);

      expect(result).toBe(0);
    });

    it('should throw NotFoundException if playlist does not exist', async () => {
      (mockPlaylistRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getPlaylistRevision(999)).rejects.toThrow(NotFoundException);
    });
  });
});
