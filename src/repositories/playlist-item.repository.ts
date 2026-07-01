import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlaylistItemEntity } from '../entities';

@Injectable()
export class PlaylistItemRepository extends Repository<PlaylistItemEntity> {
  constructor(private dataSource: DataSource) {
    super(PlaylistItemEntity, dataSource.createEntityManager());
  }

 async findByPlaylistId(playlistId: number): Promise<PlaylistItemEntity[]> {
  return this.find({
    where: { playlistId },
    relations: {
      file: true,
    },
    order: { position: 'ASC' },
  });
}

async findByPlaylistIdAndPosition(
  playlistId: number,
  position: number,
): Promise<PlaylistItemEntity | null> {
  return this.findOne({
    where: { playlistId, position },
    relations: {
      file: true,
    },
  });
}

  async findMaxPositionInPlaylist(playlistId: number): Promise<number> {
    const result = await this.findOne({
      where: { playlistId },
      order: { position: 'DESC' },
    });
    return result?.position ?? 0;
  }

  async deleteByPlaylistId(playlistId: number): Promise<void> {
    await this.delete({ playlistId });
  }
}
