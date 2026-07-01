import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CacheManifestEntity } from '../entities';

@Injectable()
export class CacheManifestRepository extends Repository<CacheManifestEntity> {
  constructor(private dataSource: DataSource) {
    super(CacheManifestEntity, dataSource.createEntityManager());
  }

  async findByScreenId(screenId: number): Promise<CacheManifestEntity | null> {
    return this.findOne({ where: { screenId } });
  }

  async findByScreenIdAndRevision(
    screenId: number,
    revision: number,
  ): Promise<CacheManifestEntity | null> {
    return this.findOne({
      where: { screenId, revision },
    });
  }

  async upsertManifest(
    screenId: number,
    revision: number,
    manifest: Record<string, any>,
  ): Promise<CacheManifestEntity> {
    const existing = await this.findByScreenId(screenId);

    if (existing) {
      existing.revision = revision;
      existing.manifest = manifest;
      return this.save(existing);
    }

    const newManifest = this.create({
      screenId,
      revision,
      manifest,
    });
    return this.save(newManifest);
  }

  async getAllManifests(): Promise<CacheManifestEntity[]> {
    return this.find();
  }

  async deleteByScreenId(screenId: number): Promise<void> {
    await this.delete({ screenId });
  }
}
