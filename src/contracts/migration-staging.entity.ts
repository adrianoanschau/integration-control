export abstract class MigrationStaging {
  id: number;
  static factory<D, S>(target: S, data: D): S {
    return Object.assign(target, data);
  }
}
