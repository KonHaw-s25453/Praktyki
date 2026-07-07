import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';
import { ScreenPlaylistEntity } from './screen-playlist.entity';
import { ScreenStateEntity } from './screen-state.entity';

@Entity('playlists')
export class PlaylistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 1 })
  revision: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PlaylistItemEntity, (item: any) => item.playlist, { cascade: true })
  items: PlaylistItemEntity[];

  @OneToMany(() => ScreenPlaylistEntity, (sp: any) => sp.playlist, { cascade: true })
  screenPlaylists: ScreenPlaylistEntity[];

  @OneToMany(() => ScreenStateEntity, (state: any) => state.currentPlaylist)
  screenStates: ScreenStateEntity[];
}
