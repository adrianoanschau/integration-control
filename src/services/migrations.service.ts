import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Migration } from '../entities/migration.entity';
import { Repository } from 'typeorm';
import { MigrationsEnum } from '../enums/migrations.enum';

@Injectable()
export class MigrationsService {
  constructor(
    @InjectRepository(Migration)
    private repository: Repository<Migration>,
  ) {}

  async selectMigration(migrationName: MigrationsEnum) {
    const [migration] = await this.repository.find({
      name: migrationName,
    });
    return migration;
  }
}
