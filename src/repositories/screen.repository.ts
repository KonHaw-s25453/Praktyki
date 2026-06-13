import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScreenEntity } from '@/entities';

@Injectable()
export class ScreenRepository extends Repository<ScreenEntity> {
  constructor(private dataSource: DataSource) {
    super(ScreenEntity, dataSource.createEntityManager());
  }

  async findByApiKey(apiKey: string): Promise<ScreenEntity | null> {
    return this.findOne({
      where: { apiKey },
      relations: ['screenPlaylists', 'screenPlaylists.playlist', 'state', 'fallbackFile'],
    });
  }

  async findWithPlaylists(id: number): Promise<ScreenEntity | null> {
    return this.findOne({
      where: { id },
      relations: [
        'screenPlaylists',
        'screenPlaylists.playlist',
        'screenPlaylists.playlist.items',
        'screenPlaylists.playlist.items.file',
        'state',
        'fallbackFile',
      ],
    });
  }

  async findByLocation(location: string): Promise<ScreenEntity[]> {
    return this.find({
      where: { location },
      relations: ['screenPlaylists', 'state'],
    });
  }

  async findAllWithState(): Promise<ScreenEntity[]> {
    return this.find({
      relations: ['state', 'screenPlaylists'],
    });
  }

  async updateLastSeen(id: number): Promise<void> {
    await this.update(id, { lastSeen: new Date() });
  }
}
