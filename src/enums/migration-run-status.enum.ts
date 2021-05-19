export enum MigrationRunStatusEnum {
  SUCCESS = 1,
  VALIDATION_ERROR,
  INTEGRATION_ERROR,
}

export const MigrationRunStatusTxt = {
  [MigrationRunStatusEnum.SUCCESS]: 'Migração realizada com sucesso',
  [MigrationRunStatusEnum.VALIDATION_ERROR]: 'Erro de validação',
  [MigrationRunStatusEnum.INTEGRATION_ERROR]: 'Erro de integração',
};
