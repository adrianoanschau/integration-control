import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import * as dot from 'dot-object';
import { ValidationException } from '../../../../src/exceptions/validation.exception';
import { ValidationExceptionResponse } from '../../../../src/interfaces/validation-exception-response.interface';
import { MigrationValidationExceptionResponse } from '../interfaces/migration-validation-exception-response.interface';
import {
  MigrationStatusEnum,
  MigrationStatusTxt,
} from '../enums/migration-status.enum';
import {
  MigrationRunStatusEnum,
  MigrationRunStatusTxt,
} from '../enums/migration-run-status.enum';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(
    exception: ValidationException,
    host: ArgumentsHost,
  ): Response<MigrationValidationExceptionResponse> {
    const [{ body }, response] = ValidationExceptionFilter.getContext(host);
    const status = exception.getStatus();

    return response.status(status).json({
      errors: [
        {
          status,
          title: exception.name,
          details: ValidationExceptionFilter.mapErrors(exception, body),
        },
      ],
    });
  }

  private static getContext(host: ArgumentsHost): [Request, Response] {
    const ctx = host.switchToHttp();
    return [ctx.getRequest<Request>(), ctx.getResponse<Response>()];
  }

  private static mapErrors(
    exception: ValidationException,
    body: any,
  ): MigrationValidationExceptionResponse[] {
    return ValidationExceptionFilter.getExceptionResponse(exception).map(
      (error) => {
        if (error.path.startsWith('migrations.')) {
          return ValidationExceptionFilter.migrationError(error, body);
        } else {
          return ValidationExceptionFilter.runError(error);
        }
      },
    );
  }

  private static getExceptionResponse(
    exception: ValidationException,
  ): ValidationExceptionResponse[] {
    return exception.getResponse() as ValidationExceptionResponse[];
  }

  private static migrationError(error: ValidationExceptionResponse, body: any) {
    return {
      ...error,
      cod_error: MigrationStatusEnum.VALIDATION_ERROR,
      txt_error: MigrationStatusTxt[MigrationStatusEnum.VALIDATION_ERROR],
      migration_id: dot.pick(
        error.path
          .split('.')
          .filter((c_, k) => k < 2)
          .join('.')
          .concat('.migration_id'),
        body,
      ),
    };
  }

  private static runError(error: ValidationExceptionResponse) {
    return {
      ...error,
      cod_error: MigrationRunStatusEnum.VALIDATION_ERROR,
      txt_error: MigrationRunStatusTxt[MigrationRunStatusEnum.VALIDATION_ERROR],
      migration_id: null,
    };
  }
}
