import { ValidationExceptionResponse } from '../../../../src/interfaces/validation-exception-response.interface';

export interface MigrationValidationExceptionResponse
  extends ValidationExceptionResponse {
  cod_error: number;
  txt_error: string;
  migration_id: number;
}
