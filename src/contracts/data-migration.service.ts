import { QueryRunner, Repository } from 'typeorm';
import { MigrationRun } from '../entities/migration-run.entity';
import { MigrationResponse } from '../interfaces/response.interface';
import { MigrationsRunService } from '../services/migrations-run.service';
import { MigrationExecutionDto } from '../interfaces/migration-execution-dto.interface';
import { MigrationsEnum } from '../enums/migrations.enum';
import { MigrationControlDto } from '../interfaces/migration-control-dto.interface';
import { MigrationStatusEnum, MigrationStatusTxt } from '../enums/migration-status.enum';
import { MigrationStaging } from './migration-staging.entity';

export abstract class DataMigrationService<S extends MigrationStaging, D> {
  protected queryRunner: QueryRunner;
  protected run: MigrationRun;
  protected success: MigrationResponse[] = [];
  protected errors: MigrationResponse[] = [];

  protected constructor(
    protected repository: Repository<S>,
    protected runService: MigrationsRunService<S>,
  ) {}

  abstract dtoToEntity(data: D): S;

  async migrate({
    migrations,
    ...executionDto
  }: MigrationExecutionDto<D>): Promise<{
    success: MigrationResponse[];
    error: MigrationResponse[];
  }> {
    await this.prepareMigrations(executionDto);
    await this.runMigrations(migrations);
    await this.finishMigrations();
    return { success: this.success, error: this.errors };
  }

  protected async prepareMigrations(
    executionDto: Omit<MigrationExecutionDto<D>, 'migrations'>,
  ) {
    this.success = [];
    this.errors = [];
    this.run = await this.runService.start(
      MigrationsEnum.RECEIPTS,
      executionDto,
    );
    this.queryRunner = this.repository.manager.connection.createQueryRunner();
    return this.queryRunner.connect();
  }

  protected async runMigrations(migrations: MigrationControlDto<D>[]) {
    for (const migration of migrations) {
      await this.processMigration(migration);
    }
  }

  private async processMigration({
    migration_id,
    batch_sequence,
    client_occurrence,
    data,
  }: MigrationControlDto<D>) {
    await this.queryRunner.startTransaction();
    try {
      await this.registerMigration(
        data,
        batch_sequence,
        client_occurrence,
        migration_id,
      );
      await this.queryRunner.commitTransaction();
      this.success.push({
        cod_error: MigrationStatusEnum.SUCCESS,
        message: MigrationStatusTxt[MigrationStatusEnum.SUCCESS],
        migration_id,
      });
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      this.errors.push({
        cod_error: MigrationStatusEnum.INTEGRATION_ERROR,
        message: MigrationStatusTxt[MigrationStatusEnum.INTEGRATION_ERROR],
        details: `${err.name || 'Error'}: ${err.message || 'unknown'}`,
        migration_id,
      });
    }
  }

  private async registerMigration(
    data: D,
    batch_sequence: number,
    client_occurrence: Date,
    migration_id: number,
  ) {
    const staging = await this.queryRunner.manager.save(this.dtoToEntity(data));
    await this.runService.register(
      this.run,
      staging.id,
      batch_sequence,
      client_occurrence,
      migration_id,
    );
  }

  protected async finishMigrations() {
    await this.queryRunner.release();
    await this.runService.finish(
      this.run,
      this.success.length,
      this.errors.length,
    );
  }
}
