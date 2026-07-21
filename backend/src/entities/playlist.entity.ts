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
import { ApiProperty } from '@nestjs/swagger';


@Entity('playlists')
export class PlaylistEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  revision: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
  type: () => [PlaylistItemEntity],
  })
  @OneToMany(() => PlaylistItemEntity, item => item.playlist, { cascade: true })
  items: PlaylistItemEntity[];
  
  @ApiProperty({
  type: () => [ScreenPlaylistEntity],
  })
  @OneToMany(() => ScreenPlaylistEntity, sp => sp.playlist, { cascade: true })
  screenPlaylists: ScreenPlaylistEntity[];

  @ApiProperty({
  type: () => [ScreenStateEntity],
  })
  @OneToMany(() => ScreenStateEntity, state => state.currentPlaylist)
  screenStates: ScreenStateEntity[];
}
