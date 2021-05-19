import { ValidationExceptionResponse } from '@grazz/integration-service';

export interface MigrationValidationExceptionResponse
  extends ValidationExceptionResponse {
  cod_error: number;
  txt_error: string;
  migration_id: number;
}
