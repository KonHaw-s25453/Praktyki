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
    screen: { id: screenId },
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
  visible: boolean,
): Promise<void> {
  await this.update(screenId, {
    currentIndex: index,
    visible,
    updatedAt: new Date(),
  });

  await this.dataSource
    .createQueryBuilder()
    .relation(ScreenStateEntity, 'currentPlaylist')
    .of(screenId)
    .set(playlistId);
  }

async updateVisibility(
  screenId: number,
  visible: boolean,
): Promise<void> {
  console.log(
    `[VISIBILITY] updateVisibility screen=${screenId}, visible=${visible}`,
  );

  await this.update(screenId, {
    visible,
    updatedAt: new Date(),
  });

  console.log(
    `[VISIBILITY] saved screen=${screenId}, visible=${visible}`,
  );
}

 async clearPlaybackState(screenId: number): Promise<void> {
  await this.update(screenId, {
    currentIndex: 0,
  });

  await this.dataSource
    .createQueryBuilder()
    .relation(ScreenStateEntity, 'currentPlaylist')
    .of(screenId)
    .set(null);
    }

  async getAllStates(): Promise<ScreenStateEntity[]> {
    return this.createQueryBuilder('ss')
      .leftJoinAndSelect('ss.currentPlaylist', 'playlist')
      .getMany();
  }
}
