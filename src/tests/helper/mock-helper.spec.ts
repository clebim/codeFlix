import faker from 'faker';

import { changeValuesMock } from './mock-helper.mock';

describe('test changeValuesMock helper', () => {
  let bodyToReplace: Record<string, any>;

  beforeEach(() => {
    bodyToReplace = {
      name: faker.datatype.string(22),
      email: faker.internet.email(),
      address: {
        street: faker.datatype.string(22),
        number: faker.datatype.number(999),
      },
      date: faker.date.recent(),
      spd: [2, '02', 9, 11],
      objectList: [
        {
          name: faker.datatype.string(22),
          email: faker.internet.email(),
        },
        {
          name: faker.datatype.string(22),
          email: faker.internet.email(),
        },
      ],
      file: {
        buffer: Buffer.from('TESTE UNITARIO'),
        size: faker.datatype.number(9999),
      },
    };
  });

  it('change values successfully with parameter replaceInsideListObject false', () => {
    const replaces = {
      name: 'Matheus aaa',
      address: {
        street: 'Rosas',
      },
      date: new Date('2022-08-10'),
      objectList: [
        {
          name: 'Diego',
          email: 'teste@teste.com',
        },
      ],
      file: {
        buffer: Buffer.from('@AL5BANK'),
      },
    };

    const { name, address, date, objectList, file } = changeValuesMock(
      bodyToReplace,
      replaces,
      false,
    );

    expect(name).toEqual(replaces.name);
    expect(address.street).toEqual(replaces.address.street);
    expect(date).toEqual(replaces.date);
    expect(objectList).toEqual(replaces.objectList);
    expect(file.buffer.toString()).toEqual('@AL5BANK');
  });

  it('change values successfully with parameter replaceInsideListObject true', () => {
    const replaces = {
      name: 'Matheus aaa',
      address: {
        street: 'Rosas',
      },
      date: new Date('2022-08-10'),
      spd: ['Testando'],
      objectList: [
        {
          name: 'Diego',
          email: 'teste@teste.com',
        },
        {
          name: 'Matheus',
          email: 'matheus@teste.com',
        },
      ],
      file: {
        buffer: Buffer.from('@AL5BANK'),
      },
    };

    const { name, address, date, objectList, file, spd } = changeValuesMock(
      bodyToReplace,
      replaces,
      false,
    );

    expect(name).toEqual(replaces.name);
    expect(address.street).toEqual(replaces.address.street);
    expect(date).toEqual(replaces.date);
    expect(objectList[0].email).toEqual(replaces.objectList[0].email);
    expect(objectList[1].email).toEqual(replaces.objectList[1].email);
    expect(spd).toEqual(['Testando']);
    expect(file.buffer.toString()).toEqual('@AL5BANK');
  });

  it('No change values because object changes is empty', () => {
    const response = changeValuesMock(bodyToReplace);

    expect(response).toEqual(bodyToReplace);
  });

  it('change values successfully with object inside object...', () => {
    const body = {
      teste1: {
        street: faker.datatype.string(22),
        number: faker.datatype.number(999),
        teste2: {
          street: faker.datatype.string(22),
          number: faker.datatype.number(999),
          teste3: {
            street: faker.datatype.string(22),
            number: faker.datatype.number(999),
          },
        },
      },
    };

    const replace = {
      teste1: {
        street: 'teste1',
        teste2: {
          street: 'teste2',
          teste3: {
            street: 'teste3',
          },
        },
      },
    };

    const response = changeValuesMock(body, replace);

    expect(response.teste1.street).toEqual('teste1');
    expect(response.teste1.teste2.street).toEqual('teste2');
    expect(response.teste1.teste2.teste3.street).toEqual('teste3');
  });
});
