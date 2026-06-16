import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenEntity, ScreenPlaylistEntity, FileEntity } from '@/entities';
import {
  ScreenRepository,
  ScreenPlaylistRepository,
  FileRepository,
} from '@/repositories';
import { ScreensService } from './screens.service.js';
import { ScreensController } from './screens.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenEntity, ScreenPlaylistEntity, FileEntity])],
  providers: [ScreenRepository, ScreenPlaylistRepository, FileRepository, ScreensService],
  controllers: [ScreensController],
  exports: [ScreensService],
})
export class ScreensModule {}
