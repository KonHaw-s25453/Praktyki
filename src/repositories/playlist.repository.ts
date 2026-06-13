import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlaylistEntity } from '@/entities';

@Injectable()
export class PlaylistRepository extends Repository<PlaylistEntity> {
  constructor(private dataSource: DataSource) {
    super(PlaylistEntity, dataSource.createEntityManager());
  }

  async findWithItems(id: number): Promise<PlaylistEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['items', 'items.file'],
    });
  }

  async findAllWithItems(): Promise<PlaylistEntity[]> {
    return this.find({
      relations: ['items', 'items.file'],
    });
  }

  async findByName(name: string): Promise<PlaylistEntity | null> {
    return this.findOne({ where: { name } });
  }

  async findByRevision(revision: number): Promise<PlaylistEntity[]> {
    return this.find({ where: { revision } });
  }
}
