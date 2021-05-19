import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MigrationRun } from './migration-run.entity';

@Entity('MIG_MIGRATIONS')
export class Migration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MigrationRun, (run) => run.migration)
  runs: MigrationRun[];
}
