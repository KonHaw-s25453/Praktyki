import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScreenEntity } from '../entities';

const SCREEN_ONLINE_TIMEOUT = 90_000; // 90 sekund
@Injectable()
export class ScreenRepository extends Repository<ScreenEntity> {
  constructor(private dataSource: DataSource) {
    super(ScreenEntity, dataSource.createEntityManager());
  }

  async findByApiKey(apiKey: string): Promise<ScreenEntity | null> {
    return this.findOne({
      where: { apiKey },
      relations: {
        screenPlaylists: {
          playlist: true,
        },
        state: true,
        fallbackFile: true,
      },
    });
  }

  async findWithPlaylists(id: number): Promise<ScreenEntity | null> {
  return this.findOne({
    where: { id },
    relations: {
      screenPlaylists: {
        playlist: {
          items: {
            file: true,
          },
        },
      },
      state: true,
      fallbackFile: true,
    },
  });
}

  async findByLocation(location: string): Promise<ScreenEntity[]> {
    return this.find({
      where: { location },
      relations: {
        screenPlaylists: {
          playlist: true,
        },
        state: true,
        fallbackFile: true,
      },
    });
  }

async findAllWithState(): Promise<ScreenEntity[]> {
  const screens = await this.find({
    relations: {
      state: true,
      fallbackFile: true,
      screenPlaylists: {
        playlist: {
          items: {
            file: true,
          },
        },
      },
    },
  });

  const now = Date.now();

console.log(
  "[SCREEN PLAYLIST DEBUG]",
  JSON.stringify(
    screens.map(screen => ({
      screenId: screen.id,
      playlists: screen.screenPlaylists?.map(sp => ({
        id: sp.id,
        playlistId: sp.playlistId,
        playlist: sp.playlist,
        playlistName: sp.playlist?.name,
      })),
    })),
    null,
    2
  )
);

  return screens.map((screen) => {
    const isOnline =
      screen.lastSeen !== null &&
      now - screen.lastSeen.getTime() < SCREEN_ONLINE_TIMEOUT;

    screen.isOnline = isOnline;

    return screen;
  });
}

async updateLastSeen(
  screenId: number,
  playerUrl?: string,
): Promise<boolean> {
  const screen = await this.findOne({
    where: { id: screenId },
  });

  if (!screen) {
    return false;
  }

  const wasOffline = !screen.isOnline;

  const updateData: Partial<ScreenEntity> = {
    lastSeen: new Date(),
    isOnline: true,
  };

  if (playerUrl !== undefined) {
    updateData.playerUrl = playerUrl;
  }

  await this.update(screenId, updateData);

  const updated = await this.findOne({
    where: { id: screenId },
  });

  console.log('[LAST SEEN TEST]', {
    screenId,
    lastSeen: updated?.lastSeen,
    isOnline: updated?.isOnline,
    playerUrl: updated?.playerUrl,
  });

  return wasOffline;
}
}