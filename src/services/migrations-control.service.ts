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
    MIG_STG_ID: number,
    BATCH_SEQUENCE: number,
    CLIENT_OCCURRENCE: Date,
    CLIENT_MIGRATION_ID: number,
    STATUS_MESSAGE: string,
  ) {
    return this.repository.insert({
      run,
      MIG_STG_ID,
      BATCH_SEQUENCE,
      CLIENT_OCCURRENCE,
      CLIENT_MIGRATION_ID,
      STATUS_MESSAGE,
    });
  }
}
