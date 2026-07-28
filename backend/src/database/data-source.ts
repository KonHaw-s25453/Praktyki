import { DataSource } from 'typeorm';

import { CacheManifestEntity } from '../entities/cache-manifest.entity';
import { FileEntity } from '../entities/file.entity';
import { PlaylistEntity } from '../entities/playlist.entity';
import { PlaylistItemEntity } from '../entities/playlist-item.entity';
import { ScreenEntity } from '../entities/screen.entity';
import { ScreenLogEntity } from '../entities/screen-log.entity';
import { ScreenPlaylistEntity } from '../entities/screen-playlist.entity';
import { ScreenStateEntity } from '../entities/screen-state.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'praktyki',

  entities: [
    FileEntity,
    PlaylistEntity,
    PlaylistItemEntity,
    ScreenEntity,
    ScreenPlaylistEntity,
    ScreenLogEntity,
    CacheManifestEntity,
    ScreenStateEntity,
  ],

  migrations: [
    'src/migrations/*.ts',
  ],

  synchronize: false,
});