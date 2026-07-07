import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  checksum: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PlaylistItemEntity, (item: any) => item.file)
  playlistItems: PlaylistItemEntity[];

  @OneToOne('ScreenEntity', (screen: any) => screen.fallbackFile)
  screenAsFallback: any;
}
