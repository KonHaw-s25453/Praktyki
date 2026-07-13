import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { FileEntity } from '../../entities';
import { FileRepository } from '../../repositories';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({
      dest: './files',
    }),
  ],
  providers: [FileRepository, FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}