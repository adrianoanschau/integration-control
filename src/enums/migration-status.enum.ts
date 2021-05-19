export enum MigrationStatusEnum {
  SUCCESS = 1,
  VALIDATION_ERROR,
  INTEGRATION_ERROR,
}

export const MigrationStatusTxt = {
  [MigrationStatusEnum.SUCCESS]: 'Migração realizada com sucesso',
  [MigrationStatusEnum.VALIDATION_ERROR]: 'Erro de validação',
  [MigrationStatusEnum.INTEGRATION_ERROR]: 'Erro de integração',
};
