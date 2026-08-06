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
import { Index } from 'typeorm';
@Entity('playlist_items')
@Index(['playlist', 'position'])
export class PlaylistItemEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'int' })
  position: number;

  @ApiProperty()
  @Column({ type: 'int', default: 10 })
  duration: number;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  videoLoops: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
  type: () => PlaylistEntity,
})
  @ManyToOne(() => PlaylistEntity, playlist => playlist.items, {
  onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;

  @ApiProperty({
  type: () => FileEntity,
})
  @ManyToOne(() => FileEntity, file => file.playlistItems, {
  onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}

