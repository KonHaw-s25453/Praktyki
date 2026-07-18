import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ScreenPlaylistEntity } from './screen-playlist.entity';
import { ScreenLogEntity } from './screen-log.entity';
import { ScreenStateEntity } from './screen-state.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity('screens')
export class ScreenEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  apiKey: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'int', nullable: true })
  fallbackFileId: number | null;

  @Column({ type: 'timestamp', nullable: true })
  lastSeen: Date | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @OneToMany(() => ScreenPlaylistEntity, (sp: any) => sp.screen, { cascade: true })
  screenPlaylists: ScreenPlaylistEntity[];

  @ApiProperty()
  @OneToMany(() => ScreenLogEntity, (log: any) => log.screen, { cascade: true })
  logs: ScreenLogEntity[];

  @ApiProperty()
  @OneToOne(() => ScreenStateEntity, (state: any) => state.screen, { cascade: true })
  state: ScreenStateEntity;

  @ApiProperty({ nullable: true })
  @OneToOne('FileEntity', { nullable: true })
  @JoinColumn({ name: 'fallback_file_id' })
  fallbackFile: any;
}
