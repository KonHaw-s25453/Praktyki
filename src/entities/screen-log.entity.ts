import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScreenEntity } from './screen.entity.js';

@Entity('screen_logs')
export class ScreenLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  screenId: number | null;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ScreenEntity, screen => screen.logs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'screen_id' })
  screen: ScreenEntity | null;
}
