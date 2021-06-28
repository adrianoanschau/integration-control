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
  ID: number;

  @OneToOne(() => Migration)
  @JoinColumn({ name: 'MIG_MIGRATION_ID' })
  migration: Migration;

  @Column({ type: 'int' })
  CLIENT_RUN: number;

  @Column({ type: 'int', width: 3 })
  UNITY_CODE: number;

  @Column({ type: 'timestamp' })
  RUN_START: Date;

  @Column({ type: 'timestamp', default: null })
  RUN_END: Date;

  @Column({ type: 'int', width: 11, default: null })
  TOTAL_LOTS: number;

  @Column({ type: 'int', width: 11, default: null })
  TOTAL_RECORDS: number;

  @Column({ type: 'int', width: 11, default: null })
  SUCCESS_RECORDS: number;

  @Column({ type: 'int', width: 11, default: null })
  ERROR_RECORDS: number;

  @Column({ type: 'int', width: 1 })
  STATUS: number;

  @Column()
  STATUS_MESSAGE: string;
}
