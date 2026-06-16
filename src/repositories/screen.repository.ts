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
      relations: {
        screenPlaylists: {
          playlist: true,
        },
        state: true,
        fallbackFile: true,
      },
    });
  }

  async findWithPlaylists(id: number): Promise<ScreenEntity | null> {
    return this.findOne({
      where: { id },
      relations: {
        screenPlaylists: {
          playlist: {
            items: {
              file: true,
            },
          },
        },
        state: true,
        fallbackFile: true,
      },
    });
  }

  async findByLocation(location: string): Promise<ScreenEntity[]> {
    return this.find({
      where: { location },
      relations: {
        screenPlaylists: {
          playlist: true,
        },
        state: true,
      },
    });
  }

  async findAllWithState(): Promise<ScreenEntity[]> {
    return this.find({
      relations: {
        state: true,
        screenPlaylists: true,
      },
    });
  }

  async updateLastSeen(id: number): Promise<void> {
    await this.update(id, { lastSeen: new Date() });
  }
}