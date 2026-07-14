import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from '../../entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody,ApiResponse } from '@nestjs/swagger';
import type { Express } from 'express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}



  @Post()
  create(@Body() createFileDto: CreateFileDto): Promise<FileEntity> {
    return this.filesService.create(createFileDto);
  }

  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
@ApiResponse({
  status: 201,
  type: FileEntity,
})
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
uploadFile(
 @UploadedFile() file: Express.Multer.File,
): Promise<FileEntity> {
  return this.filesService.upload(file);
}

  @Get()
  findAll(): Promise<FileEntity[]> {
    return this.filesService.findAll();
  }

  @Get('videos')
  getAllVideos(): Promise<FileEntity[]> {
    return this.filesService.getAllVideos();
  }

  @Get('images')
  getAllImages(): Promise<FileEntity[]> {
    return this.filesService.getAllImages();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<FileEntity> {
    return this.filesService.findById(id);
  }

  @Get(':id/used')
  checkIfUsed(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.filesService.checkIfFileIsUsed(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileEntity> {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.filesService.delete(id);
  }




}