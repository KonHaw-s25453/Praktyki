import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity, PlaylistItemEntity, FileEntity } from '../../entities';
import { PlaylistRepository, PlaylistItemRepository, FileRepository, CacheManifestRepository } from '../../repositories';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { ScreenPlaylistRepository } from '../../repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity, PlaylistItemEntity, FileEntity])],
  providers: [PlaylistRepository, PlaylistItemRepository, ScreenPlaylistRepository, CacheManifestRepository, FileRepository, PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
