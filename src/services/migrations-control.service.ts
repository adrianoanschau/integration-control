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
    CLIENT_OCCURRENCE: string,
    CLIENT_MIGRATION_ID: number,
    STATUS_MESSAGE: string,
  ) {
    return this.repository.insert({
      run,
      MIG_STG_ID,
      BATCH_SEQUENCE,
      CLIENT_OCCURRENCE: () =>
        `TO_TIMESTAMP('${CLIENT_OCCURRENCE}', 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')`,
      CLIENT_MIGRATION_ID,
      STATUS_MESSAGE,
    });
  }
}
