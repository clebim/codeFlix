import { generateUniqueId } from '../shared/domain/unique-entity-id';

type EntityProperties<T = object> = {
  props: T;
  id?: string;
};

export class Entity<Props extends EntityProperties, Y = string> {
  public readonly id: Y | string;

  constructor(id?: Y) {
    this.id = id ?? generateUniqueId();
  }

  private checkIfConvertToJSON(value: any): boolean {
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Error) &&
      !(value instanceof Object)
    ) {
      return true;
    }
    return false;
  }

  private checkIfIsArray(value: any): boolean {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(element => typeof element === 'object')
    ) {
      return true;
    }

    return false;
  }

  private transformToObject<T>(array: any): T {
    return array.reduce(
      (obj: any, item: any[]) => Object.assign(obj, { [item[0]]: item[1] }),
      {},
    );
  }

  protected classToPlain<T>(entity: Props): T & { id: string | Y } {
    let valueToBeReturned: any[][] = [[]];

    if (entity.props) {
      const objectToArray = Object.entries(entity.props);

      valueToBeReturned = objectToArray.map(([key, value]) => {
        if (this.checkIfConvertToJSON(value)) {
          return [key, this.classToPlain(value)];
        }

        if (this.checkIfIsArray(value)) {
          return [key, value.map(dataObject => this.classToPlain(dataObject))];
        }

        return [key, value];
      });
    }

    const value = this.transformToObject<T>(valueToBeReturned);

    return {
      id: entity.id,
      ...value,
    };
  }
}
