import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { MigRuns1620136672184 } from './1620136672184-MigRuns';

export class MigControl1620139430625 implements MigrationInterface {
  static tableName = 'MIG_CONTROL';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: MigControl1620139430625.tableName,
        columns: [
          {
            name: 'ID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'MIG_RUN_ID',
            type: 'int',
          },
          {
            name: 'MIG_STG_ID',
            type: 'int',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'CLIENT_MIGRATION_ID',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'BATCH_SEQUENCE',
            type: 'int',
            width: 2,
          },
          {
            name: 'STATUS',
            type: 'int',
            width: 1,
            default: 0,
          },
          {
            name: 'STATUS_MESSAGE',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'CLIENT_OCCURRENCE',
            type: 'timestamp',
          },
          {
            name: 'SERVICE_OCCURRENCE',
            type: 'timestamp',
            default: 'sysdate',
          },
        ],
        foreignKeys: [
          {
            name: 'control_run_fk',
            columnNames: ['MIG_RUN_ID'],
            referencedTableName: MigRuns1620136672184.tableName,
            referencedColumnNames: ['ID'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(MigControl1620139430625.tableName, true);
  }
}
