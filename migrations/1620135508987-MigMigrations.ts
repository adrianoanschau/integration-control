import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MigMigrations1620135508987 implements MigrationInterface {
  static tableName = 'MIG_MIGRATIONS';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: MigMigrations1620135508987.tableName,
        columns: [
          {
            name: 'ID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'NAME',
            type: 'varchar',
            length: '32',
            isUnique: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(MigMigrations1620135508987.tableName, true);
  }
}
