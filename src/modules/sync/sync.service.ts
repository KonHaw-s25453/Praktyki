import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ScreenRepository,
  CacheManifestRepository,
  ScreenStateRepository,
  ScreenLogRepository,
  ScreenPlaylistRepository,
  PlaylistRepository,
  PlaylistItemRepository,
  FileRepository,
} from '@/repositories';
import { CacheManifestEntity, ScreenStateEntity } from '@/entities';

@Injectable()
export class SyncService {
  constructor(
    private screenRepository: ScreenRepository,
    private cacheManifestRepository: CacheManifestRepository,
    private screenStateRepository: ScreenStateRepository,
    private screenLogRepository: ScreenLogRepository,
    private screenPlaylistRepository: ScreenPlaylistRepository,
    private playlistRepository: PlaylistRepository,
    private playlistItemRepository: PlaylistItemRepository,
    private fileRepository: FileRepository,
  ) {}

  /**
   * Get manifest for screen - core sync logic
   */
  async getManifestForScreen(
    screenId: number,
    sinceRevision?: number,
  ): Promise<{ revision: number; manifest: Record<string, any>; status: 'OK' | 'NOT_CHANGED' }> {
    const screen = await this.screenRepository.findWithPlaylists(screenId);
    if (!screen) {
      throw new NotFoundException(`Screen with ID ${screenId} not found`);
    }

    // Pobierz cached manifest
    const cachedManifest = await this.cacheManifestRepository.findByScreenId(screenId);

    if (!cachedManifest) {
      // Jeśli cache nie istnieje, wygeneruj
      await this.regenerateManifestForScreen(screenId);
      return this.getManifestForScreen(screenId, sinceRevision);
    }

    // Jeśli client ma aktualną wersję, zwróć NOT_CHANGED
    if (sinceRevision && sinceRevision === cachedManifest.revision) {
      return {
        revision: cachedManifest.revision,
        manifest: {},
        status: 'NOT_CHANGED',
      };
    }

    // Update last_seen
    await this.screenRepository.updateLastSeen(screenId);

    return {
      revision: cachedManifest.revision,
      manifest: cachedManifest.manifest,
      status: 'OK',
    };
  }

  /**
   * Regenerate manifest for screen (call when playlist/assignment changes)
   */
  async regenerateManifestForScreen(screenId: number): Promise<CacheManifestEntity> {
    const screen = await this.screenRepository.findWithPlaylists(screenId);
    if (!screen) {
      throw new NotFoundException(`Screen with ID ${screenId} not found`);
    }

    // Pobierz aktywne playlisty (wg czasu)
    const activeAssignments = await this.screenPlaylistRepository.findActiveByScreenId(
      screenId,
    );

    // Zbuduj manifest
    const manifest = await this.buildManifest(activeAssignments, screen);

    // Oblicz revision
    let maxRevision = 0;
    for (const assignment of activeAssignments) {
      maxRevision = Math.max(
        maxRevision,
        assignment.revision,
        assignment.playlist.revision,
      );
    }

    // Upsert do cache
    return this.cacheManifestRepository.upsertManifest(screenId, maxRevision, manifest);
  }

  /**
   * Update screen state (where it is in playback)
   */
  async updateScreenState(
    screenId: number,
    currentPlaylistId: number,
    currentIndex: number,
  ): Promise<ScreenStateEntity | null> {
    await this.screenStateRepository.updateCurrentPlayback(
      screenId,
      currentPlaylistId,
      currentIndex,
    );
    return this.screenStateRepository.findByScreenId(screenId);
  }

  /**
   * Record log from screen
   */
  async recordLog(
    screenId: number,
    message: string,
    level: 'INFO' | 'ERROR' | 'PLAYBACK' = 'INFO',
  ): Promise<void> {
    const screen = await this.screenRepository.findOne({ where: { id: screenId } });
    if (!screen) {
      throw new NotFoundException(`Screen with ID ${screenId} not found`);
    }

    await this.screenLogRepository.save({
      screenId,
      message,
      level,
    });
  }

  /**
   * Get fallback asset for screen
   */
  async getFallbackAsset(screenId: number): Promise<any> {
    const screen = await this.screenRepository.findOne({
      where: { id: screenId },
      relations: { fallbackFile: true },
    });

    if (!screen) {
      throw new NotFoundException(`Screen with ID ${screenId} not found`);
    }

    if (!screen.fallbackFile) {
      return null;
    }

    return {
      id: screen.fallbackFile.id,
      filename: screen.fallbackFile.filename,
      path: screen.fallbackFile.path,
      mimeType: screen.fallbackFile.mimeType,
      duration: screen.fallbackFile.duration,
      size: screen.fallbackFile.size,
      checksum: screen.fallbackFile.checksum,
    };
  }

  /**
   * Build manifest JSON from screen's playlists
   */
  private async buildManifest(activeAssignments: any[], screen: any): Promise<Record<string, any>> {
    const playlists = [];

    for (const assignment of activeAssignments) {
      const items = [];

      for (const item of assignment.playlist.items) {
        items.push({
          position: item.position,
          duration: item.duration,
          file: {
            id: item.file.id,
            filename: item.file.filename,
            path: item.file.path,
            mimeType: item.file.mimeType,
            size: item.file.size,
            checksum: item.file.checksum,
          },
        });
      }

      playlists.push({
        id: assignment.playlist.id,
        name: assignment.playlist.name,
        revision: assignment.playlist.revision,
        priority: assignment.priority,
        activeFrom: assignment.activeFrom,
        activeTo: assignment.activeTo,
        items: items.sort((a, b) => a.position - b.position),
      });
    }

    return {
      screenId: screen.id,
      timestamp: new Date().toISOString(),
      playlists: playlists.sort((a, b) => a.priority - b.priority),
      fallback: screen.fallbackFile
        ? {
            id: screen.fallbackFile.id,
            filename: screen.fallbackFile.filename,
            path: screen.fallbackFile.path,
          }
        : null,
    };
  }

  /**
   * Check if manifest changed
   */
  async checkIfManifestChanged(
    screenId: number,
    clientRevision: number,
  ): Promise<{ changed: boolean; currentRevision: number }> {
    const cached = await this.cacheManifestRepository.findByScreenId(screenId);

    if (!cached) {
      return { changed: true, currentRevision: 0 };
    }

    return {
      changed: cached.revision !== clientRevision,
      currentRevision: cached.revision,
    };
  }

  /**
   * Invalidate cache for screen (call after playlist/assignment change)
   */
  async invalidateCache(screenId: number): Promise<void> {
    await this.cacheManifestRepository.deleteByScreenId(screenId);
  }

  /**
   * Get recent logs for screen
   */
  async getScreenLogs(screenId: number, limit = 100): Promise<any[]> {
    return this.screenLogRepository.findByScreenId(screenId, limit);
  }
}
