import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FileEntity,
  PlaylistEntity,
  PlaylistItemEntity,
  ScreenEntity,
  ScreenPlaylistEntity,
  ScreenLogEntity,
  CacheManifestEntity,
  ScreenStateEntity,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'praktyki'),
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
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
