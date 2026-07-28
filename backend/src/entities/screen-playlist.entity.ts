import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScreenEntity } from './screen.entity';
import { PlaylistEntity } from './playlist.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';


@Entity('screen_playlists')
export class ScreenPlaylistEntity {

  @ApiProperty({ description: 'Unique identifier for the screen-playlist association' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Identifier for the associated screen' })
  @Column({
  name: 'screen_id',
  type: 'int',
})
screenId: number;

@ApiProperty({ description: 'Identifier for the associated playlist' })
@Column({
  name: 'playlist_id',
  type: 'int',
})
playlistId: number;

  @ApiProperty({ description: 'Priority of the screen-playlist association' })
  @Column({ type: 'int', default: 1 })
  priority: number;

  @ApiProperty({ nullable: true, description: 'Start date and time when the playlist becomes active on the screen' })
  @Column({ type: 'datetime', nullable: true })
  activeFrom: Date | null;

  @ApiProperty({ nullable: true, description: 'End date and time when the playlist is no longer active on the screen' })
  @Column({ type: 'datetime', nullable: true })
  activeTo: Date | null;

  @ApiProperty({ description: 'Revision number for the screen-playlist association' })
  @Column({ type: 'int', default: 1 })
  revision: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiHideProperty()
  @ManyToOne(() => ScreenEntity, screen => screen.screenPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'screen_id' })
  screen: ScreenEntity;

  @ApiHideProperty()
  @ManyToOne(() => PlaylistEntity, playlist => playlist.screenPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;
}
