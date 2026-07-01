import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ScreenEntity } from './screen.entity';

@Entity('cache_manifests')
@Index('uk_cache_manifests_screen_id', ['screenId'], { unique: true })
export class CacheManifestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  screenId: number;

  @Column({ type: 'int' })
  revision: number;

  @Column({ type: 'json' })
  manifest: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ScreenEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id' })
  screen: ScreenEntity;
}
