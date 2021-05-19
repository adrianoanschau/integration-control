import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { MigMigrations1620135508987 } from './1620135508987-MigMigrations';

export class MigRuns1620136672184 implements MigrationInterface {
  static tableName = 'MIG_RUNS';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: MigRuns1620136672184.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mig_migration_id',
            type: 'int',
          },
          {
            name: 'client_run',
            type: 'int',
          },
          {
            name: 'unity_code',
            type: 'int',
            width: 3,
          },
          {
            name: 'run_start',
            type: 'timestamp',
            default: 'sysdate',
          },
          {
            name: 'run_end',
            type: 'timestamp',
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'total_lots',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'total_records',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'success_records',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'error_records',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'status',
            type: 'int',
            width: 1,
            default: '0',
          },
          {
            name: 'status_message',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'migrations_run_fk',
            columnNames: ['mig_migration_id'],
            referencedTableName: MigMigrations1620135508987.tableName,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'client_run_unity_code_uk',
            columnNames: ['client_run', 'unity_code'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      MigRuns1620136672184.tableName,
      true,
    );
  }
}
