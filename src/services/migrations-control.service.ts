import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MigrationControl } from '../entities/migration-control.entity';
import { MigrationRun } from '../entities/migration-run.entity';

@Injectable()
export class MigrationsControlService<T> {
  constructor(
    @InjectRepository(MigrationControl)
    private repository: Repository<MigrationControl>,
  ) {}

  async save(
    run: MigrationRun,
    mig_stg_id: number,
    batch_sequence: number,
    client_occurrence: Date,
    client_migration_id: number,
  ) {
    return this.repository.insert({
      run,
      mig_stg_id,
      batch_sequence,
      client_occurrence,
      client_migration_id,
    });
  }
}
