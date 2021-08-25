import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MigrationRun } from './migration-run.entity';

@Entity('MIG_CONTROL')
export class MigrationControl {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => MigrationRun)
  @JoinColumn({ name: 'MIG_RUN_ID' })
  run: MigrationRun;

  @Column()
  MIG_STG_ID: number;

  @Column()
  CLIENT_MIGRATION_ID: number;

  @Column()
  BATCH_SEQUENCE: number;

  @Column()
  STATUS: number;

  @Column()
  STATUS_MESSAGE: string;

  @Column()
  CLIENT_OCCURRENCE: string;

  @Column()
  SERVICE_OCCURRENCE: string;
}
