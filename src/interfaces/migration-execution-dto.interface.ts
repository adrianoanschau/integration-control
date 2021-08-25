import { IsNumber, ValidateNested } from 'class-validator';
import { MigrationControlDto } from '@grazz/integration-control/interfaces/migration-control-dto.interface';
import { Type } from 'class-transformer';

export class MigrationExecutionDto {
  @IsNumber()
  execution: number;
  @IsNumber()
  unity_code: number;
  @IsNumber()
  total_lots: number;
  @IsNumber()
  total_records: number;
  @ValidateNested()
  @Type(() => MigrationControlDto)
  migrations: MigrationControlDto[];
}
