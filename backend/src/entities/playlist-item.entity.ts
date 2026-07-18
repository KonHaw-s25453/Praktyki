import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { FileEntity } from './file.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('playlist_items')
export class PlaylistItemEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'int' })
  playlistId: number;

  @ApiProperty()
  @Column({ type: 'int' })
  fileId: number;

  @ApiProperty()
  @Column({ type: 'int' })
  position: number;

  @ApiProperty()
  @Column({ type: 'int', default: 10 })
  duration: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => PlaylistEntity, playlist => playlist.items, {
    onDelete: 'CASCADE',
  })
  @ApiProperty()
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;

  @ApiProperty()
  @ManyToOne(() => FileEntity, file => file.playlistItems, {
    onDelete: 'CASCADE',
  })

  @ApiProperty()
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
