import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScreenLogRepository } from '../../repositories';


@Injectable()
export class LogCleanupService {
  private readonly logger = new Logger(LogCleanupService.name);

  constructor(
    private readonly screenLogRepository: ScreenLogRepository,
  ) {}

  async onModuleInit(): Promise<void> {
  await this.cleanupOldLogs();
}

@Cron('0 12 * * *')
async cleanupOldLogs(): Promise<void> {
  await this.screenLogRepository.deleteOldLogs(30);

  const deletedExcess =
    await this.screenLogRepository.deleteExcessLogs(100_000);

  if (deletedExcess > 0) {
    this.logger.warn(
      `Deleted ${deletedExcess} excess screen logs`,
    );
  } else {
    this.logger.log('Old screen logs cleaned up');
  }
}
}