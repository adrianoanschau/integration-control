import { IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class MigrationControlDto {
  @IsNumber()
  migration_id: number;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  client_occurrence: Date;
  @IsNumber()
  batch_sequence: number;
  data: any;
}
