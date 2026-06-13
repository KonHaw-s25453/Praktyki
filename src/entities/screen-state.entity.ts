import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ScreenEntity } from './screen.entity.js';
import { PlaylistEntity } from './playlist.entity.js';

@Entity('screen_state')
export class ScreenStateEntity {
  @PrimaryColumn({ type: 'int' })
  screenId: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSync: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastPlaylistHash: string | null;

  @Column({ type: 'int', nullable: true })
  currentPlaylistId: number | null;

  @Column({ type: 'int', default: 0 })
  currentIndex: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ScreenEntity, screen => screen.state, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'screen_id' })
  screen: ScreenEntity;

  @ManyToOne(() => PlaylistEntity, playlist => playlist.screenStates, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'current_playlist_id' })
  currentPlaylist: PlaylistEntity | null;
}
