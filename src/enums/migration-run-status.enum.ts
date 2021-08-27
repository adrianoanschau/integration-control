export enum MigrationRunStatusEnum {
  SUCCESS = 1,
  VALIDATION_ERROR,
  INTEGRATION_ERROR,
  DATABASE_ERROR,
}

export const MigrationRunStatusTxt = {
  [MigrationRunStatusEnum.SUCCESS]: 'Migração realizada com sucesso',
  [MigrationRunStatusEnum.VALIDATION_ERROR]: 'Erro de validação',
  [MigrationRunStatusEnum.INTEGRATION_ERROR]: 'Erro de integração',
  [MigrationRunStatusEnum.DATABASE_ERROR]: 'Erro de Banco de Dados',
};
