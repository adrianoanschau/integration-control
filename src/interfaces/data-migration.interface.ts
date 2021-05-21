import { QueryRunner } from 'typeorm';
import { MigrationRun } from '@grazz/integration-control/entities/migration-run.entity';
import { MigrationResponse } from '@grazz/integration-control';

export interface DataMigration {
  queryRunner: QueryRunner;
  run: MigrationRun;
  success: MigrationResponse[];
  errors: MigrationResponse[];
}
