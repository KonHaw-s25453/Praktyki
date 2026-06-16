import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ScreensService } from './screens.service.js';
import { CreateScreenDto } from './dto/create-screen.dto.js';
import { AssignPlaylistDto } from './dto/assign-playlist.dto.js';
import { ScreenEntity, ScreenPlaylistEntity } from '@/entities';

@Controller('screens')
export class ScreensController {
  constructor(private screensService: ScreensService) {}

  @Post()
  create(@Body() createScreenDto: CreateScreenDto): Promise<ScreenEntity> {
    return this.screensService.create(createScreenDto);
  }

  @Get()
  findAll(): Promise<ScreenEntity[]> {
    return this.screensService.findAll();
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScreenEntity> {
    return this.screensService.findById(id, true);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.screensService.delete(id);
  }

  @Post(':id/playlists')
  assignPlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignPlaylistDto: AssignPlaylistDto,
  ): Promise<ScreenPlaylistEntity> {
    return this.screensService.assignPlaylistToScreen(id, assignPlaylistDto);
  }

  @Delete(':id/playlists/:playlistId')
  removePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<void> {
    return this.screensService.removePlaylistFromScreen(id, playlistId);
  }

  @Put(':id/playlists/:playlistId')
  updateAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() updates: any,
  ): Promise<ScreenPlaylistEntity> {
    return this.screensService.updateAssignment(
      id,
      playlistId,
      updates.priority,
      updates.activeFrom,
      updates.activeTo,
    );
  }

  @Post(':id/api-key')
  generateNewApiKey(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.screensService.generateNewApiKey(id);
  }

  @Post(':id/heartbeat')
  heartbeat(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.screensService.updateLastSeen(id);
  }

  @Get('location/:location')
  getByLocation(@Param('location') location: string): Promise<ScreenEntity[]> {
    return this.screensService.getScreensInLocation(location);
  }
}
