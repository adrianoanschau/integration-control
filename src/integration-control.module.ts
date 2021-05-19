import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Migration } from './entities/migration.entity';
import { MigrationRun } from './entities/migration-run.entity';
import { MigrationControl } from './entities/migration-control.entity';
import { MigrationsService } from './services/migrations.service';
import { MigrationsRunService } from './services/migrations-run.service';
import { MigrationsControlService } from './services/migrations-control.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        autoLoadEntities: true,
        migrationsTableName: 'MIGRATIONS_API_MIGRATIONS',
        migrations: ['dist/migrations/*.{js,ts}'],
        cli: {
          migrationsDir: 'migrations',
        },
      }),
    }),
    TypeOrmModule.forFeature([Migration, MigrationRun, MigrationControl]),
  ],
  providers: [
    MigrationsService,
    MigrationsRunService,
    MigrationsControlService,
  ],
  exports: [MigrationsRunService, MigrationsControlService],
})
export class IntegrationControlModule {}
