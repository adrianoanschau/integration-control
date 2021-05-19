import { MigrationControlDto } from './migration-control-dto.interface';

export interface MigrationExecutionDto<T> {
  execution: number;
  unity_code: number;
  total_lots: number;
  total_records: number;
  migrations: MigrationControlDto<T>[];
}
