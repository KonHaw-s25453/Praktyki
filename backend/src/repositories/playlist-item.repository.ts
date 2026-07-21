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
      where: {
        playlist: {
          id: playlistId,
        },
      },
      relations: {
        file: true,
      },
      order: {
        position: 'ASC',
      },
    });
  }

  async findByPlaylistIdAndPosition(
    playlistId: number,
    position: number,
  ): Promise<PlaylistItemEntity | null> {
    return this.findOne({
      where: {
        playlist: {
          id: playlistId,
        },
        position,
      },
      relations: {
        file: true,
      },
    });
  }

  async findMaxPositionInPlaylist(playlistId: number): Promise<number> {
    const result = await this.findOne({
      where: {
        playlist: {
          id: playlistId,
        },
      },
      order: {
        position: 'DESC',
      },
    });

    return result?.position ?? 0;
  }

  async deleteByPlaylistId(playlistId: number): Promise<void> {
  const items = await this.findByPlaylistId(playlistId);
  await this.remove(items);
}

}