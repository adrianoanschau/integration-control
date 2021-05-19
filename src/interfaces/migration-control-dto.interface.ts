export interface MigrationControlDto<T> {
  migration_id: number;
  client_occurrence: Date;
  batch_sequence: number;
  data: T;
}
