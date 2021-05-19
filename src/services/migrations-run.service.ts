import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MigrationRun } from '../entities/migration-run.entity';
import { MigrationsEnum } from '../enums/migrations.enum';
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
    executionDto: Omit<MigrationExecutionDto<any>, 'migrations'>,
  ) {
    if (run.total_lots !== executionDto.total_lots) {
      throw new InvalidRunException();
    }
    if (run.total_records !== executionDto.total_records) {
      throw new InvalidRunException();
    }
  }

  private async open(
    migration: Migration,
    executionDto: Omit<MigrationExecutionDto<any>, 'migrations'>,
  ) {
    const data = {
      migration,
      client_run: executionDto.execution,
      unity_code: executionDto.unity_code,
    };
    let [in_execution] = await this.repository.find({
      ...data,
      run_end: null,
    });
    if (!in_execution) {
      const insert = await this.repository.insert({
        ...data,
        run_start: new Date().toISOString(),
        total_lots: executionDto.total_lots,
        total_records: executionDto.total_records,
      });
      in_execution = await this.repository.findOne(insert.raw.id);
    }
    this.validateExecution(in_execution, executionDto);
    return in_execution;
  }

  async start(
    migrationName: MigrationsEnum,
    executionDto: Omit<MigrationExecutionDto<any>, 'migrations'>,
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
    client_occurrence: Date,
    migration_id: number,
  ) {
    return this.controlService.save(
      run,
      staging_id,
      batch_sequence,
      client_occurrence,
      migration_id,
    );
  }

  private async close(run: MigrationRun) {
    return this.repository.update(
      {
        id: run.id,
      },
      {
        run_end: new Date().toISOString(),
      },
    );
  }

  async finish(run: MigrationRun, success: number, error: number) {
    const update = await this.repository.update(
      {
        id: run.id,
      },
      {
        success_records: (run.success_records || 0) + success,
        error_records: (run.error_records || 0) + error,
      },
    );
    run = await this.repository.findOne(run.id);
    if (
      run.total_records ===
      (run.success_records || 0) + (run.error_records || 0)
    ) {
      await this.close(run);
    }
    return update;
  }
}
