import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { FilesModule } from './modules/files/files.module.js';
import { PlaylistsModule } from './modules/playlists/playlists.module.js';
import { ScreensModule } from './modules/screens/screens.module.js';
import { SyncModule } from './modules/sync/sync.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    FilesModule,
    PlaylistsModule,
    ScreensModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
