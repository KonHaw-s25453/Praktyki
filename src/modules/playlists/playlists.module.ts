import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity, PlaylistItemEntity, FileEntity } from '@/entities';
import { PlaylistRepository, PlaylistItemRepository, FileRepository } from '@/repositories';
import { PlaylistsService } from './playlists.service.js';
import { PlaylistsController } from './playlists.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity, PlaylistItemEntity, FileEntity])],
  providers: [PlaylistRepository, PlaylistItemRepository, FileRepository, PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
