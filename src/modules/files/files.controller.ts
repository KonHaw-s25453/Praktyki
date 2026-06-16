import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { FilesService } from './files.service.js';
import { CreateFileDto } from './dto/create-file.dto.js';
import { UpdateFileDto } from './dto/update-file.dto.js';
import { FileEntity } from '@/entities';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto): Promise<FileEntity> {
    return this.filesService.create(createFileDto);
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
