import { IsDateString, IsNumber } from 'class-validator';

export class MigrationControlDto {
  @IsNumber()
  migration_id: number;
  @IsDateString()
  client_occurrence: string;
  @IsNumber()
  batch_sequence: number;
  data: any;
}
