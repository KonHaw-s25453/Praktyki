import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { ScreenPlaylistEntity } from './screen-playlist.entity';
import { ScreenLogEntity } from './screen-log.entity';
import { ScreenStateEntity } from './screen-state.entity';
import { FileEntity } from './file.entity';

import { ApiProperty } from '@nestjs/swagger';

@Entity('screens')
export class ScreenEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;


  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;


  @ApiProperty({ nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location: string | null;


  @ApiProperty({ nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  apiKey: string | null;


  @ApiProperty({
    description: 'ID pliku fallback',
  })
  @Column({
    name: 'fallback_file_id',
    type: 'int',
  })
  fallbackFileId: number;

  @ApiProperty({ nullable: true })
  @Column({
      type: 'varchar',
      length: 500,
      nullable: true,
  })
    playerUrl: string | null;

  @ManyToOne(
    () => FileEntity,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'fallback_file_id',
  })
  fallbackFile: FileEntity;


  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastSeen: Date | null;


  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;



  @ApiProperty({
    type: () => [ScreenPlaylistEntity],
  })
  @OneToMany(
    () => ScreenPlaylistEntity,
    (sp) => sp.screen,
    {
      cascade: true,
    },
  )
  screenPlaylists: ScreenPlaylistEntity[];



  @ApiProperty({
    type: () => [ScreenLogEntity],
  })
 
  @ApiProperty({
    type: () => ScreenStateEntity,
    nullable: true,
  })
  @OneToOne(
    () => ScreenStateEntity,
    (state) => state.screen,
    {
      cascade: true,
    },
  )
  state: ScreenStateEntity | null;
}