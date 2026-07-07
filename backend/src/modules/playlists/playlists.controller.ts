import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddItemToPlaylistDto } from './dto/add-item.dto';
import { ReorderPlaylistItemsDto } from './dto/reorder-items.dto';
import { PlaylistEntity, PlaylistItemEntity } from '../../entities';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto): Promise<PlaylistEntity> {
    return this.playlistsService.create(createPlaylistDto);
  }

  @Get()
  findAll(): Promise<PlaylistEntity[]> {
    return this.playlistsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<PlaylistEntity> {
    return this.playlistsService.findById(id);
  }

  @Get(':id/revision')
  getRevision(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.playlistsService.getPlaylistRevision(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<PlaylistEntity> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.playlistsService.delete(id);
  }

  @Post(':id/items')
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemDto: AddItemToPlaylistDto,
  ): Promise<PlaylistItemEntity> {
    return this.playlistsService.addItemToPlaylist(id, addItemDto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<void> {
    return this.playlistsService.removeItemFromPlaylist(id, itemId);
  }

  @Put(':id/reorder')
  reorderItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() reorderDto: ReorderPlaylistItemsDto,
  ): Promise<void> {
    return this.playlistsService.reorderItems(id, reorderDto);
  }
}
