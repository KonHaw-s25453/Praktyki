import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileEntity } from '../entities';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(private dataSource: DataSource) {
    super(FileEntity, dataSource.createEntityManager());
  }

  async findByChecksum(checksum: string): Promise<FileEntity | null> {
    return this.findOne({ where: { checksum } });
  }

  async findByMimeType(mimeType: string): Promise<FileEntity[]> {
    return this.find({ where: { mimeType } });
  }

  async findAllVideos(): Promise<FileEntity[]> {
    return this.find({ where: { mimeType: 'video/%' } });
  }

  async findAllImages(): Promise<FileEntity[]> {
    return this.find({ where: { mimeType: 'image/%' } });
  }
}
