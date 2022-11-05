import { generateUniqueId } from '../shared/domain/unique-entity-id';

export type EntityProperties<T = object, Y = string> = {
  id?: Y;
  props: T;
};

export class Entity<Props, Y = string> {
  public readonly id: Y | string;

  public readonly props: Props;

  constructor(props: Props & { id?: Y }) {
    const { id, ...rest } = props;
    this.id = id ?? generateUniqueId();
    this.props = rest as Props;
  }

  private checkIfConvertToJSON(value: any): boolean {
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Error) &&
      value instanceof Object
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

  protected classToPlain<T>(entity: Entity<Props>): T {
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
      id: this.id,
      ...value,
    };
  }
}
