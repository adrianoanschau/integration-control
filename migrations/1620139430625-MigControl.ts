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
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mig_run_id',
            type: 'int',
          },
          {
            name: 'mig_stg_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'client_migration_id',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'batch_sequence',
            type: 'int',
            width: 2,
          },
          {
            name: 'status',
            type: 'int',
            width: 1,
            default: 0,
          },
          {
            name: 'status_message',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'client_occurrence',
            type: 'timestamp',
          },
          {
            name: 'service_occurrence',
            type: 'timestamp',
            default: 'sysdate',
          },
        ],
        foreignKeys: [
          {
            name: 'receptions_run_fk',
            columnNames: ['mig_run_id'],
            referencedTableName: MigRuns1620136672184.tableName,
            referencedColumnNames: ['id'],
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
