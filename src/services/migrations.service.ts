import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Migration } from '../entities/migration.entity';

@Injectable()
export class MigrationsService {
  constructor(
    @InjectRepository(Migration)
    private repository: Repository<Migration>,
  ) {}

  async selectMigration(name: string) {
    const [migration] = await this.repository.find({
      name,
    });
    return migration;
  }
}
