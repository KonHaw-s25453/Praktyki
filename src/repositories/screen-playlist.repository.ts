import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScreenPlaylistEntity } from '../entities';

@Injectable()
export class ScreenPlaylistRepository extends Repository<ScreenPlaylistEntity> {
  constructor(private dataSource: DataSource) {
    super(ScreenPlaylistEntity, dataSource.createEntityManager());
  }

  async findByScreenId(screenId: number): Promise<ScreenPlaylistEntity[]> {
    return this.createQueryBuilder('sp')
      .where('sp.screenId = :screenId', { screenId })
      .leftJoinAndSelect('sp.playlist', 'playlist')
      .leftJoinAndSelect('playlist.items', 'items')
      .leftJoinAndSelect('items.file', 'file')
      .orderBy('sp.priority', 'ASC')
      .getMany();
  }

  async findActiveByScreenId(screenId: number): Promise<ScreenPlaylistEntity[]> {
    const now = new Date();
    return this.createQueryBuilder('sp')
      .where('sp.screenId = :screenId', { screenId })
      .andWhere('(sp.activeFrom IS NULL OR sp.activeFrom <= :now)', { now })
      .andWhere('(sp.activeTo IS NULL OR sp.activeTo >= :now)', { now })
      .leftJoinAndSelect('sp.playlist', 'playlist')
      .leftJoinAndSelect('playlist.items', 'items')
      .leftJoinAndSelect('items.file', 'file')
      .orderBy('sp.priority', 'ASC')
      .addOrderBy('playlist.id', 'ASC')
      .getMany();
  }

  async findByPlaylistId(playlistId: number): Promise<ScreenPlaylistEntity[]> {
    return this.createQueryBuilder('sp')
      .where('sp.playlistId = :playlistId', { playlistId })
      .leftJoinAndSelect('sp.screen', 'screen')
      .getMany();
  }

  async findByScreenAndPlaylist(
    screenId: number,
    playlistId: number,
  ): Promise<ScreenPlaylistEntity | null> {
    return this.findOne({
      where: { screenId, playlistId },
    });
  }

  async updateRevisionByScreenId(screenId: number): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({ revision: () => 'revision + 1' })
      .where('screenId = :screenId', { screenId })
      .execute();
  }
}
