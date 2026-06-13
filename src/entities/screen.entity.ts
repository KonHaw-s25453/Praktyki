import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ScreenPlaylistEntity } from './screen-playlist.entity.js';
import { ScreenLogEntity } from './screen-log.entity.js';
import { ScreenStateEntity } from './screen-state.entity.js';

@Entity('screens')
export class ScreenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  apiKey: string | null;

  @Column({ type: 'int', nullable: true })
  fallbackFileId: number | null;

  @Column({ type: 'timestamp', nullable: true })
  lastSeen: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ScreenPlaylistEntity, (sp: any) => sp.screen, { cascade: true })
  screenPlaylists: ScreenPlaylistEntity[];

  @OneToMany(() => ScreenLogEntity, (log: any) => log.screen, { cascade: true })
  logs: ScreenLogEntity[];

  @OneToOne(() => ScreenStateEntity, (state: any) => state.screen, { cascade: true })
  state: ScreenStateEntity;

  @OneToOne('FileEntity', { nullable: true })
  @JoinColumn({ name: 'fallback_file_id' })
  fallbackFile: any;
}
