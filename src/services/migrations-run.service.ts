import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MigrationRun } from '../entities/migration-run.entity';
import { MigrationExecutionDto } from '../interfaces/migration-execution-dto.interface';
import { MigrationsService } from './migrations.service';
import { Migration } from '../entities/migration.entity';
import { InvalidRunException } from '../exceptions/invalid-run.exception';
import { MigrationsControlService } from './migrations-control.service';

@Injectable()
export class MigrationsRunService<T> {
  constructor(
    @InjectRepository(MigrationRun)
    private repository: Repository<MigrationRun>,
    private controlService: MigrationsControlService<T>,
    private migrationsService: MigrationsService,
  ) {}

  private validateExecution(
    run: MigrationRun,
    executionDto: Omit<MigrationExecutionDto, 'migrations'>,
  ) {
    if (run.TOTAL_LOTS !== executionDto.total_lots) {
      throw new InvalidRunException();
    }
    if (run.TOTAL_RECORDS !== executionDto.total_records) {
      throw new InvalidRunException();
    }
  }

  private async open(
    migration: Migration,
    executionDto: Omit<MigrationExecutionDto, 'migrations'>,
  ) {
    const data = {
      migration,
      CLIENT_RUN: executionDto.execution,
      UNITY_CODE: executionDto.unity_code,
    };
    let [in_execution] = await this.repository.find({
      ...data,
      RUN_END: null,
    });
    if (!in_execution) {
      const insert = await this.repository.insert({
        ...data,
        TOTAL_LOTS: executionDto.total_lots,
        TOTAL_RECORDS: executionDto.total_records,
      });
      in_execution = await this.repository.findOne(insert.raw.ID);
    }
    this.validateExecution(in_execution, executionDto);
    return in_execution;
  }

  async start(
    migrationName: string,
    executionDto: Omit<MigrationExecutionDto, 'migrations'>,
  ) {
    const migration = await this.migrationsService.selectMigration(
      migrationName,
    );
    return this.open(migration, executionDto);
  }

  async register(
    run: MigrationRun,
    staging_id: number,
    batch_sequence: number,
    client_occurrence: string,
    migration_id: number,
    status_message: string,
  ) {
    return this.controlService.save(
      run,
      staging_id,
      batch_sequence,
      client_occurrence,
      migration_id,
      status_message,
    );
  }

  private async close(run: MigrationRun) {
    return this.repository.update(
      {
        ID: run.ID,
      },
      {
        RUN_END: () => 'sysdate',
      },
    );
  }

  async finish(run: MigrationRun, success: number, error: number) {
    const update = await this.repository.update(
      {
        ID: run.ID,
      },
      {
        SUCCESS_RECORDS: (run.SUCCESS_RECORDS || 0) + success,
        ERROR_RECORDS: (run.ERROR_RECORDS || 0) + error,
      },
    );
    run = await this.repository.findOne(run.ID);
    if (
      run.TOTAL_RECORDS ===
      (run.SUCCESS_RECORDS || 0) + (run.ERROR_RECORDS || 0)
    ) {
      await this.close(run);
    }
    return update;
  }
}
