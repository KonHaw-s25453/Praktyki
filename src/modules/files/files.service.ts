import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FileRepository } from '@/repositories';
import { FileEntity } from '@/entities';
import { CreateFileDto } from './dto/create-file.dto.js';
import { UpdateFileDto } from './dto/update-file.dto.js';

@Injectable()
export class FilesService {
  constructor(private fileRepository: FileRepository) {}

  async create(createFileDto: CreateFileDto): Promise<FileEntity> {
    const file = this.fileRepository.create(createFileDto);
    return this.fileRepository.save(file);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<FileEntity> {
    const file = await this.fileRepository
      .createQueryBuilder('f')
      .where('f.id = :id', { id })
      .leftJoinAndSelect('f.playlistItems', 'items')
      .getOne();

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async findByChecksum(checksum: string): Promise<FileEntity | null> {
    return this.fileRepository.findByChecksum(checksum);
  }

  async checkIfFileIsUsed(id: number): Promise<boolean> {
    const file = await this.fileRepository
      .createQueryBuilder('f')
      .where('f.id = :id', { id })
      .leftJoinAndSelect('f.playlistItems', 'items')
      .getOne();

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file.playlistItems && file.playlistItems.length > 0;
  }

  async update(id: number, updateFileDto: UpdateFileDto): Promise<FileEntity> {
    await this.findById(id); // sprawdzić czy istnieje

    await this.fileRepository.update(id, updateFileDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const file = await this.findById(id);

    // Sprawdzić czy plik jest używany
    const isUsed = await this.checkIfFileIsUsed(id);
    if (isUsed) {
      throw new ConflictException(
        `File is used in ${file.playlistItems.length} playlist(s). Remove from playlists first.`,
      );
    }

    await this.fileRepository.delete(id);
  }

  async getFilesByMimeType(mimeType: string): Promise<FileEntity[]> {
    return this.fileRepository.findByMimeType(mimeType);
  }

  async getAllVideos(): Promise<FileEntity[]> {
    return this.fileRepository.findAllVideos();
  }

  async getAllImages(): Promise<FileEntity[]> {
    return this.fileRepository.findAllImages();
  }
}
