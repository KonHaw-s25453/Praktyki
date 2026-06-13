import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity.js';
import { FileEntity } from './file.entity.js';

@Entity('playlist_items')
export class PlaylistItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  playlistId: number;

  @Column({ type: 'int' })
  fileId: number;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'int', default: 10 })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => PlaylistEntity, playlist => playlist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;

  @ManyToOne(() => FileEntity, file => file.playlistItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
