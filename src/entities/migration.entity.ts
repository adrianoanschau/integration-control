import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MigrationRun } from './migration-run.entity';

@Entity('MIG_MIGRATIONS')
export class Migration {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  NAME: string;

  @OneToMany(() => MigrationRun, (run) => run.migration)
  runs: MigrationRun[];
}
