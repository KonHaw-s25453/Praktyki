import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ScreenEntity,
  CacheManifestEntity,
  ScreenStateEntity,
  ScreenLogEntity,
  ScreenPlaylistEntity,
  PlaylistEntity,
  PlaylistItemEntity,
  FileEntity,
} from '../../entities';
import {
  ScreenRepository,
  CacheManifestRepository,
  ScreenStateRepository,
  ScreenLogRepository,
  ScreenPlaylistRepository,
  PlaylistRepository,
  PlaylistItemRepository,
  FileRepository,
} from '../../repositories';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScreenEntity,
      CacheManifestEntity,
      ScreenStateEntity,
      ScreenLogEntity,
      ScreenPlaylistEntity,
      PlaylistEntity,
      PlaylistItemEntity,
      FileEntity,
    ]),
  ],
  providers: [
    ScreenRepository,
    CacheManifestRepository,
    ScreenStateRepository,
    ScreenLogRepository,
    ScreenPlaylistRepository,
    PlaylistRepository,
    PlaylistItemRepository,
    FileRepository,
    SyncService,
  ],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
