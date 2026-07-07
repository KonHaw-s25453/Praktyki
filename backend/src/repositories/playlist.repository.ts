import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlaylistEntity } from '../entities'; // <-- Zmieniamy na PlaylistEntity

@Injectable()
export class PlaylistRepository extends Repository<PlaylistEntity> { // <-- Poprawna nazwa klasy!
  constructor(private dataSource: DataSource) {
    super(PlaylistEntity, dataSource.createEntityManager()); // <-- Przekazujemy PlaylistEntity
  }

  // Prosta metoda pomocnicza, która pobiera playlistę razem z jej plikami (itemami)
  async findWithItems(id: number): Promise<PlaylistEntity | null> {
    return this.findOne({
      where: { id },
      relations: {
        items: {
          file: true,
        },
      },
    });
  }

  async findAllWithItems(): Promise<PlaylistEntity[]> {
    return this.find({
      relations: {
        items: {
          file: true,
        },
      },
    });
  }
}