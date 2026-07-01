import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './modules/files/files.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { ScreensModule } from './modules/screens/screens.module';
import { SyncModule } from './modules/sync/sync.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
