import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ScreenEntity } from '../../entities';
import { FileEntity } from '../../entities';
import { ScreenRepository } from '../../repositories';
import { FileRepository } from '../../repositories';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity,ScreenEntity]),
    MulterModule.register({
      dest: './files',
    }),
  ],
  providers: [FileRepository, ScreenRepository, FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}