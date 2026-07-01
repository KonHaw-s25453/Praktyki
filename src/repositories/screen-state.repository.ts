import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScreenStateEntity } from '../entities';

@Injectable()
export class ScreenStateRepository extends Repository<ScreenStateEntity> {
  constructor(private dataSource: DataSource) {
    super(ScreenStateEntity, dataSource.createEntityManager());
  }

  async findByScreenId(screenId: number): Promise<ScreenStateEntity | null> {
    return this.createQueryBuilder('ss')
      .where('ss.screenId = :screenId', { screenId })
      .leftJoinAndSelect('ss.currentPlaylist', 'playlist')
      .getOne();
  }

  async upsertScreenState(
    screenId: number,
    state: Partial<ScreenStateEntity>,
  ): Promise<ScreenStateEntity> {
    const existing = await this.findByScreenId(screenId);

    if (existing) {
      Object.assign(existing, state);
      return this.save(existing);
    }

    const newState = this.create({
      screenId,
      ...state,
    });
    return this.save(newState);
  }

  async updateLastSync(screenId: number): Promise<void> {
    await this.update(screenId, { lastSync: new Date() });
  }

  async updateCurrentPlayback(
    screenId: number,
    playlistId: number,
    index: number,
  ): Promise<void> {
    await this.update(screenId, {
      currentPlaylistId: playlistId,
      currentIndex: index,
      updatedAt: new Date(),
    });
  }

  async clearPlaybackState(screenId: number): Promise<void> {
    await this.update(screenId, {
      currentPlaylistId: null,
      currentIndex: 0,
    });
  }

  async getAllStates(): Promise<ScreenStateEntity[]> {
    return this.createQueryBuilder('ss')
      .leftJoinAndSelect('ss.currentPlaylist', 'playlist')
      .getMany();
  }
}
