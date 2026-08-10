import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenEntity, ScreenPlaylistEntity, FileEntity } from '../../entities';
import {
  ScreenRepository,
  ScreenPlaylistRepository,
  FileRepository,
  CacheManifestRepository,
} from '../../repositories';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenEntity, ScreenPlaylistEntity, FileEntity])],
  providers: [ScreenRepository, ScreenPlaylistRepository, FileRepository, ScreensService,CacheManifestRepository],
  controllers: [ScreensController],
  exports: [ScreensService],
})
export class ScreensModule {}
