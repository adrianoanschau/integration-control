import { Repository } from 'typeorm';
import { MigrationRun } from '../entities/migration-run.entity';
import { MigrationResponse } from '../interfaces/response.interface';
import { MigrationsRunService } from './migrations-run.service';
import { MigrationExecutionDto } from '../interfaces/migration-execution-dto.interface';
import { MigrationControlDto } from '../interfaces/migration-control-dto.interface';
import {
  MigrationStatusEnum,
  MigrationStatusTxt,
} from '../enums/migration-status.enum';
import { MigrationStaging } from '../contracts/migration-staging.entity';
import { UnprocessableEntityException } from '@nestjs/common';

export class DataMigration<S extends MigrationStaging, D> {
  protected run: MigrationRun;
  protected success: MigrationResponse[] = [];
  protected errors: MigrationResponse[] = [];

  private constructor(
    private migrationName: string,
    private repository: Repository<S>,
    private runService: MigrationsRunService<S>,
  ) {}

  static newMigration<S extends MigrationStaging, D>(
    migrationName: string,
    repository: Repository<S>,
    runService: MigrationsRunService<S>,
  ) {
    return new DataMigration<S, D>(migrationName, repository, runService);
  }

  async migrate(
    { migrations, ...executionDto }: MigrationExecutionDto,
    transformData?: { [k: string]: (p: any) => any },
  ): Promise<{
    success: MigrationResponse[];
    error: MigrationResponse[];
  }> {
    try {
      await this.prepareMigrations(executionDto);
      await this.runMigrations(migrations, transformData);
      await this.finishMigrations();
    } catch (err) {
      throw new UnprocessableEntityException(
        err.status_message ||
          `${err.name || 'Error'}: ${err.message || 'unknown'}`,
      );
    }
    return { success: this.success, error: this.errors };
  }

  protected async prepareMigrations(
    executionDto: Omit<MigrationExecutionDto, 'migrations'>,
  ) {
    this.success = [];
    this.errors = [];
    this.run = await this.runService.start(this.migrationName, executionDto);
  }

  protected async runMigrations(
    migrations: MigrationControlDto[],
    transformData?: { [k: string]: (p: any) => any },
  ) {
    for (const migration of migrations) {
      await this.processMigration(migration, transformData);
    }
  }

  private async processMigration(
    {
      migration_id,
      batch_sequence,
      client_occurrence,
      data,
    }: MigrationControlDto,
    transformData?: { [k: string]: (p: any) => any },
  ) {
    try {
      await this.registerMigration(
        data,
        batch_sequence,
        client_occurrence,
        migration_id,
        transformData,
      );
      this.success.push({
        cod_error: MigrationStatusEnum.SUCCESS,
        message: MigrationStatusTxt[MigrationStatusEnum.SUCCESS],
        migration_id,
      });
    } catch (err) {
      this.errors.push({
        cod_error: MigrationStatusEnum.INTEGRATION_ERROR,
        message: MigrationStatusTxt[MigrationStatusEnum.INTEGRATION_ERROR],
        details:
          err.status_message ||
          `${err.name || 'Error'}: ${err.message || 'unknown'}`,
        migration_id,
      });
    }
  }

  private static convertKeysToUppercase<T>(object: T): T {
    const converted = {};
    new Map(
      Object.entries(object).map((entry) => [entry[0].toUpperCase(), entry[1]]),
    ).forEach((value, key) => {
      const keys = key.split('.'),
        last = keys.pop();
      keys.reduce((r, a) => (r[a] = r[a] || {}), converted)[last] = value;
    });
    return converted as T;
  }

  private async registerMigration(
    data: D,
    batch_sequence: number,
    client_occurrence: string,
    migration_id: number,
    transformData?: { [k: string]: (p: any) => any },
  ) {
    let staging;
    try {
      Object.entries(transformData || {}).forEach(([key, value]) => {
        const newValue = value(data[key]);
        data[key] = () => newValue;
      });
      staging = await this.repository.insert(
        DataMigration.convertKeysToUppercase<D>(data),
      );
      await this.runService.register(
        this.run,
        staging.raw.id,
        batch_sequence,
        client_occurrence,
        migration_id,
        MigrationStatusTxt[MigrationStatusEnum.SUCCESS],
      );
    } catch (err) {
      const status_message = `${err.name || 'Error'}: ${
        err.message || 'unknown'
      }`;
      await this.runService.register(
        this.run,
        null,
        batch_sequence,
        client_occurrence,
        migration_id,
        status_message,
      );
      throw { status_message };
    }
  }

  protected async finishMigrations() {
    await this.runService.finish(
      this.run,
      this.success.length,
      this.errors.length,
    );
  }
}
