import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ScreenRepository, ScreenPlaylistRepository, FileRepository } from '../../repositories';
import { ScreenEntity, ScreenPlaylistEntity } from '../../entities';
import { CreateScreenDto } from './dto/create-screen.dto';
import { AssignPlaylistDto } from './dto/assign-playlist.dto';
import * as crypto from 'crypto';

@Injectable()
export class ScreensService {
  constructor(
    private screenRepository: ScreenRepository,
    private screenPlaylistRepository: ScreenPlaylistRepository,
    private fileRepository: FileRepository,
  ) {}

  async create(createScreenDto: CreateScreenDto): Promise<ScreenEntity> {
    const apiKey = this.generateApiKey();

    const screen = this.screenRepository.create({
      ...createScreenDto,
      apiKey,
    });

    return this.screenRepository.save(screen);
  }

  async findAll(): Promise<ScreenEntity[]> {
    return this.screenRepository.findAllWithState();
  }

  async findById(id: number, withPlaylists = false): Promise<ScreenEntity> {
    const screen = withPlaylists
      ? await this.screenRepository.findWithPlaylists(id)
      : await this.screenRepository.findOne({
          where: { id },
        });

    if (!screen) {
      throw new NotFoundException(`Screen with ID ${id} not found`);
    }

    return screen;
  }

  async findByApiKey(apiKey: string): Promise<ScreenEntity> {
    const screen = await this.screenRepository.findByApiKey(apiKey);

    if (!screen) {
      throw new NotFoundException(`Screen with API key not found`);
    }

    return screen;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.screenRepository.delete(id);
  }

  async assignPlaylistToScreen(
    screenId: number,
    assignPlaylistDto: AssignPlaylistDto,
  ): Promise<ScreenPlaylistEntity> {
    await this.findById(screenId);

    // Sprawdzić czy taka asignment już istnieje
    const existing = await this.screenPlaylistRepository.findByScreenAndPlaylist(
      screenId,
      assignPlaylistDto.playlistId,
    );

    if (existing) {
      throw new ConflictException('This playlist is already assigned to this screen');
    }

    const screenPlaylist = this.screenPlaylistRepository.create({
      screenId,
      playlistId: assignPlaylistDto.playlistId,
      priority: assignPlaylistDto.priority || 1,
      activeFrom: assignPlaylistDto.activeFrom
        ? new Date(assignPlaylistDto.activeFrom)
        : null,
      activeTo: assignPlaylistDto.activeTo ? new Date(assignPlaylistDto.activeTo) : null,
    });

    return this.screenPlaylistRepository.save(screenPlaylist);
  }

  async removePlaylistFromScreen(screenId: number, playlistId: number): Promise<void> {
    const assignment = await this.screenPlaylistRepository.findByScreenAndPlaylist(
      screenId,
      playlistId,
    );

    if (!assignment) {
      throw new NotFoundException('Playlist is not assigned to this screen');
    }

    await this.screenPlaylistRepository.delete(assignment.id);
  }


  async updateAssignment(
    screenId: number,
    playlistId: number,
    dto: { priority?: number; activeFrom?: string; activeTo?: string },
  ): Promise<ScreenPlaylistEntity> {
    const assignment = await this.screenPlaylistRepository.findByScreenAndPlaylist(
      screenId,
      playlistId,
    );

    if (!assignment) {
      throw new NotFoundException('Playlist is not assigned to this screen');
    }

    const updates: any = {};
    if (dto.priority !== undefined) updates.priority = dto.priority;
    if (dto.activeFrom !== undefined) updates.activeFrom = new Date(dto.activeFrom);
    if (dto.activeTo !== undefined) updates.activeTo = new Date(dto.activeTo);

    await this.screenPlaylistRepository.update(assignment.id, updates);

    const updatedAssignment = await this.screenPlaylistRepository.findOne({
      where: { id: assignment.id },
    });

    if (!updatedAssignment) {
      throw new NotFoundException('Updated playlist assignment not found');
    }

    return updatedAssignment;
  }

  async updateLastSeen(id: number): Promise<void> {
    await this.screenRepository.updateLastSeen(id);
  }

  async generateNewApiKey(id: number): Promise<string> {
    await this.findById(id);

    const apiKey = this.generateApiKey();
    await this.screenRepository.update(id, { apiKey });

    return apiKey;
  }

  private generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async getScreensInLocation(location: string): Promise<ScreenEntity[]> {
    return this.screenRepository.findByLocation(location);
  }
}
