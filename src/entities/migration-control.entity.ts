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
  id: number;

  @OneToOne(() => MigrationRun)
  @JoinColumn({ name: 'mig_run_id' })
  run: MigrationRun;

  @Column()
  mig_stg_id: number;

  @Column()
  client_migration_id: number;

  @Column()
  batch_sequence: number;

  @Column()
  status: number;

  @Column()
  status_message: string;

  @Column()
  client_occurrence: Date;

  @Column()
  service_occurrence: string;
}
