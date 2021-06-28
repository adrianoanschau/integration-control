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
            name: 'ID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'MIG_MIGRATION_ID',
            type: 'int',
          },
          {
            name: 'CLIENT_RUN',
            type: 'int',
          },
          {
            name: 'UNITY_CODE',
            type: 'int',
            width: 3,
          },
          {
            name: 'RUN_START',
            type: 'timestamp',
            default: 'sysdate',
          },
          {
            name: 'RUN_END',
            type: 'timestamp',
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'TOTAL_LOTS',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'TOTAL_RECORDS',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'SUCCESS_RECORDS',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'ERROR_RECORDS',
            type: 'int',
            width: 11,
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'STATUS',
            type: 'int',
            width: 1,
            default: '0',
          },
          {
            name: 'STATUS_MESSAGE',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'migrations_run_fk',
            columnNames: ['MIG_MIGRATION_ID'],
            referencedTableName: MigMigrations1620135508987.tableName,
            referencedColumnNames: ['ID'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'client_run_unity_code_uk',
            columnNames: ['CLIENT_RUN', 'UNITY_CODE'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(MigRuns1620136672184.tableName, true);
  }
}
