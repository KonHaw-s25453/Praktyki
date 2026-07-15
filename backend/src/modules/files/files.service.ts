import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FileRepository } from '../../repositories';
import { FileEntity } from '../../entities';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
      throw new NotFoundException(`Plik o ID ${id} nie został znaleziony`);
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
      throw new NotFoundException('Plik o ID ${id} nie został znaleziony');
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

    const isUsed = await this.checkIfFileIsUsed(id);

    if (isUsed) {
        throw new ConflictException(
            `Plik należy do ${file.playlistItems.length} playlist(y). Usuń go najpierw z playlisty.`,
        );
    }

    try {
        await unlink(join(process.cwd(), file.path));
    } catch (error) {
        console.warn(`Nie udało się usunąć pliku fizycznego: ${file.path}`);
    }

    await this.fileRepository.remove(file);
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
  async upload(file: Express.Multer.File): Promise<FileEntity> {
  const fileEntity = this.fileRepository.create({
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
    checksum: '',
    duration: 0,
  });

  return this.fileRepository.save(fileEntity);
}
}
