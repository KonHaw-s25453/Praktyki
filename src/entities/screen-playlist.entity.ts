import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScreenEntity } from './screen.entity.js';
import { PlaylistEntity } from './playlist.entity.js';

@Entity('screen_playlists')
export class ScreenPlaylistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  screenId: number;

  @Column({ type: 'int' })
  playlistId: number;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'datetime', nullable: true })
  activeFrom: Date | null;

  @Column({ type: 'datetime', nullable: true })
  activeTo: Date | null;

  @Column({ type: 'int', default: 1 })
  revision: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ScreenEntity, screen => screen.screenPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'screen_id' })
  screen: ScreenEntity;

  @ManyToOne(() => PlaylistEntity, playlist => playlist.screenPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;
}
