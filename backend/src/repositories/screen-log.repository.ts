import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScreenLogEntity } from '../entities';

@Injectable()
export class ScreenLogRepository extends Repository<ScreenLogEntity> {
  constructor(private dataSource: DataSource) {
    super(ScreenLogEntity, dataSource.createEntityManager());
  }

  async findByScreenId(screenId: number, limit: number = 100): Promise<ScreenLogEntity[]> {
    return this.find({
      where: { screenId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByLevel(level: string, limit: number = 100): Promise<ScreenLogEntity[]> {
    return this.find({
      where: { level },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRecentLogs(limit: number = 100): Promise<ScreenLogEntity[]> {
    return this.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByScreenIdAndLevel(
    screenId: number,
    level: string,
    limit: number = 50,
  ): Promise<ScreenLogEntity[]> {
    return this.find({
      where: { screenId, level },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async deleteOldLogs(daysOld: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    await this.createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();
  }
}
