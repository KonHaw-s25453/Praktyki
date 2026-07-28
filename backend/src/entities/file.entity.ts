import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ScreenEntity } from './screen.entity';
@Entity('files')
export class FileEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500 })
  path: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @ApiProperty()
  @Column({ type: 'int' })
  size: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 128, nullable: true })
  checksum: string | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @OneToMany(() => PlaylistItemEntity, (item: any) => item.file)
  playlistItems: PlaylistItemEntity[];

  @ApiHideProperty()
  @OneToOne(
  () => ScreenEntity,
  screen => screen.fallbackFile,
  )
  screenAsFallback: ScreenEntity | null;
  }
