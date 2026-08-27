import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ScreenEntity } from './screen.entity';
import { PlaylistEntity } from './playlist.entity';

@Entity('screen_state')
export class ScreenStateEntity {
  @PrimaryColumn({
    name: 'screen_id',
    type: 'int',
  })
  screenId: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSync: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastPlaylistHash: string | null;

  @Column({ type: 'int', default: 0 })
  currentIndex: number;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

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

  @RelationId((state: ScreenStateEntity) => state.currentPlaylist)
  currentPlaylistId: number | null;
  }