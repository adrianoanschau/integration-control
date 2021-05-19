import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Migration } from './migration.entity';

@Entity('MIG_RUNS')
export class MigrationRun {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Migration)
  @JoinColumn({ name: 'mig_migration_id' })
  migration: Migration;

  @Column({ type: 'int' })
  client_run: number;

  @Column({ type: 'int', width: 3 })
  unity_code: number;

  @Column({ type: 'timestamp' })
  run_start: Date;

  @Column({ type: 'timestamp', default: null })
  run_end: Date;

  @Column({ type: 'int', width: 11, default: null })
  total_lots: number;

  @Column({ type: 'int', width: 11, default: null })
  total_records: number;

  @Column({ type: 'int', width: 11, default: null })
  success_records: number;

  @Column({ type: 'int', width: 11, default: null })
  error_records: number;

  @Column({ type: 'int', width: 1 })
  status: number;

  @Column()
  status_message: string;
}
