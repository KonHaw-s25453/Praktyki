import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PlaylistRepository, PlaylistItemRepository, FileRepository } from '../../repositories';
import { PlaylistEntity, PlaylistItemEntity } from '../../entities';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddItemToPlaylistDto } from './dto/add-item.dto';
import { ReorderPlaylistItemsDto } from './dto/reorder-items.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    private playlistRepository: PlaylistRepository,
    private playlistItemRepository: PlaylistItemRepository,
    private fileRepository: FileRepository,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<PlaylistEntity> {
    const playlist = this.playlistRepository.create(createPlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async findAll(): Promise<PlaylistEntity[]> {
    return this.playlistRepository.findAllWithItems();
  }

async findById(id: number): Promise<PlaylistEntity> {

    const playlist = await this.playlistRepository.findWithItems(id);

    if (!playlist) {
        throw new NotFoundException(
            `Playlist ${id} not found`
        );
    }

    return playlist;
}

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<PlaylistEntity> {
    await this.findById(id); // sprawdzić czy istnieje

    await this.playlistRepository.update(id, updatePlaylistDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // sprawdzić czy istnieje
    await this.playlistRepository.delete(id);
  }

  async addItemToPlaylist(
    playlistId: number,
    addItemDto: AddItemToPlaylistDto,
  ): Promise<PlaylistItemEntity> {
    const playlist = await this.findById(playlistId);
    const file = await this.fileRepository.findOne({
      where: { id: addItemDto.fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${addItemDto.fileId} not found`);
    }

    // Sprawdzić czy item już istnieje
    const existingItem = await this.playlistItemRepository.findByPlaylistIdAndPosition(
      playlistId,
      addItemDto.position,
    );

    if (existingItem) {
      throw new BadRequestException(
        `Item at position ${addItemDto.position} already exists in playlist`,
      );
    }

    const item = this.playlistItemRepository.create({
      playlist,
      file:file,
      position: addItemDto.position,
      duration: addItemDto.duration,
    });

    return this.playlistItemRepository.save(item);
  }

  async removeItemFromPlaylist(playlistId: number, itemId: number): Promise<void> {
    await this.findById(playlistId);

   const item = await this.playlistItemRepository.findOne({
  where: {
    id: itemId,
  },
  relations: {
    playlist: true,
  },
});
    if (!item || item.playlist.id !== playlistId) {
      throw new NotFoundException(`Item with ID ${itemId} not found in this playlist`);
    }

    await this.playlistItemRepository.delete(itemId);
  }

  async reorderItems(playlistId: number, reorderDto: ReorderPlaylistItemsDto): Promise<void> {
    await this.findById(playlistId);

    const items = await this.playlistItemRepository.findByPlaylistId(playlistId);

    if (items.length !== reorderDto.itemIds.length) {
      throw new BadRequestException('Mismatch in number of items');
    }

    // Aktualizuj pozycje
    for (let position = 0; position < reorderDto.itemIds.length; position++) {
      const itemId = reorderDto.itemIds[position];
      const item = items.find(i => i.id === itemId);

      if (!item) {
        throw new BadRequestException(`Item with ID ${itemId} not found`);
      }

      await this.playlistItemRepository.update(itemId, { position });
    }
  }

  async getPlaylistRevision(id: number): Promise<number> {
    const playlist = await this.playlistRepository.findOne({ where: { id } });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    return playlist.revision ?? 0;
  }
}
