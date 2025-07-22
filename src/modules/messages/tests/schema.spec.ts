import { omit, omitAll } from 'lodash/fp';
import {
  parse,
  parseGetQuery,
  parseId,
  parseInsertable,
  parseMessage,
  parseSprintCode,
  parseUsername,
} from '../schema';
import { fakeMessageFull } from './utils/utils';
import {
  ERROR_EMPTY_MESSAGE,
  ERROR_EMPTY_USERNAME,
  ERROR_TOO_LONG_MESSAGE,
  ERROR_TOO_LONG_USERNAME,
  MAX_LENGTH_MESSAGE,
  MAX_LENGTH_USERNAME,
} from '../utils/constants';
import { ERROR_INVALID_SPRINTCODE } from '@/modules/sprints/utils/constants';

describe('parse', () => {
  it('Parses a valid record', async () => {
    const record = fakeMessageFull();

    expect(parse(record)).toEqual(record);
  });

  describe('Property message validation', () => {
    it('Throws an error due to missing message', () => {
      const record = omit(['message'], fakeMessageFull());

      expect(() => parse(record)).toThrow(/message/i);
    });
  });

  describe('Property sprintCode validation', () => {
    it('Throws an error due to empty sprintCode', () => {
      const sprintWithEmptySprintCode = fakeMessageFull({
        sprintCode: '',
      });

      expect(() => parse(sprintWithEmptySprintCode)).toThrow(/sprintCode/i);
    });

    it('Throws an error due to missing sprintCode', () => {
      const sprintWithoutSprintCode = omit(['sprintCode'], fakeMessageFull());

      expect(() => parse(sprintWithoutSprintCode)).toThrow(/sprintCode/i);
    });

    it('Throws an error due to invalid sprintCode', () => {
      const sprintWithInvalidSprintCode = fakeMessageFull({
        sprintCode: 'WD1.1',
      });
      expect(() => parse(sprintWithInvalidSprintCode)).toThrow(
        ERROR_INVALID_SPRINTCODE
      );
    });
  });

  describe('Property username validation', () => {
    it('Throws an error due to missing username', () => {
      const record = omit(['username'], fakeMessageFull());

      expect(() => parse(record)).toThrow(/username/i);
    });
  });

  describe('Property createdAt validation', () => {
    it('Throws an error due to missing createdAt', () => {
      const record = omit(['createdAt'], fakeMessageFull());

      expect(() => parse(record)).toThrow(/createdAt/i);
    });

    it('Throws an error due to invalid createdAt', () => {
      const record = fakeMessageFull({
        createdAt: '123456',
      });

      expect(() => parse(record)).toThrow(/createdAt/i);
    });
  });
});

describe('parseId', () => {
  it('Parses a valid id', () => {
    const id = 1;

    expect(parseId(id)).toEqual(id);
  });

  it('Throws an error for id which is float type', () => {
    const realValueId = 1.1;

    expect(() => parseId(realValueId)).toThrow(/expected int/i);
  });

  it('Throws an error for id which is negative', () => {
    const negativeId = -1;

    expect(() => parseId(negativeId)).toThrow(/Too small/i);
  });
});

describe('parseMessage', () => {
  it('Throws an error due to empty message', () => {
    const message = '';

    expect(() => parseMessage(message)).toThrow(ERROR_EMPTY_MESSAGE);
  });

  it('Throws an error due to too long message', () => {
    const message = 'a'.repeat(MAX_LENGTH_MESSAGE + 1);

    expect(() => parseMessage(message)).toThrow(ERROR_TOO_LONG_MESSAGE);
  });
});

describe('parseUsername', () => {
  it('Throws an error due to empty username', () => {
    const username = '';

    expect(() => parseUsername(username)).toThrow(ERROR_EMPTY_USERNAME);
  });

  it('Throws an error due to too long username', () => {
    const username = 'a'.repeat(MAX_LENGTH_USERNAME + 1);

    expect(() => parseUsername(username)).toThrow(ERROR_TOO_LONG_USERNAME);
  });
});

describe('parseSprintCode', () => {
  it('Throws an error due to empty sprintCode', () => {
    const sprintCode = '';

    expect(() => parseSprintCode(sprintCode)).toThrow(ERROR_INVALID_SPRINTCODE);
  });

  it('Throws an error due to invalid sprintCode', () => {
    const sprintCode = 'TP-1.';

    expect(() => parseSprintCode(sprintCode)).toThrow(ERROR_INVALID_SPRINTCODE);
  });

  it('Parses a valid sprintCode', () => {
    const sprintCode = 'WD-1.1';

    expect(parseSprintCode(sprintCode)).toEqual(sprintCode);
  });
});

describe('parseInsertable', () => {
  it('Should omit id and createdAt', () => {
    const parsed = parseInsertable(fakeMessageFull());

    expect(parsed).not.toHaveProperty('id');
    expect(parsed).not.toHaveProperty('createdAt');
  });
});

describe('parseGetQuery', () => {
  const getQuery = {
    username: 'fakeUsername',
    sprint: 'WD-1.1',
  };

  it('Should return both username and sprint', () => {
    const expectedResult = {
      username: getQuery.username,
      sprintCode: getQuery.sprint,
    };

    const parsed = parseGetQuery(getQuery);

    expect(parsed).toStrictEqual(expectedResult);
  });

  it('Should only return username', () => {
    const { username, sprintCode } = parseGetQuery(omit(['sprint'], getQuery));

    expect(username).toBe(getQuery.username);
    expect(sprintCode).toBeUndefined();
  });

  it('Should only return sprintCode', () => {
    const { username, sprintCode } = parseGetQuery(
      omit(['username'], getQuery)
    );

    expect(username).toBeUndefined();
    expect(sprintCode).toBe(getQuery.sprint);
  });

  it('Should return both undefined', () => {
    const expectedResult = {
      username: undefined,
      sprintCode: undefined,
    };

    const parsed = parseGetQuery(omitAll(['username', 'sprint'], getQuery));

    expect(parsed).toStrictEqual(expectedResult);
  });

  it('Should throw an error on invalid username', () => {
    const getQueryInvalid = { username: 'a'.repeat(MAX_LENGTH_USERNAME + 1) };

    expect(() => parseGetQuery(getQueryInvalid)).toThrow(
      ERROR_TOO_LONG_USERNAME
    );
  });

  it('Should throw an error on invalid sprint', () => {
    const getQueryInvalid = {
      sprint: 'WD1-1',
    };

    expect(() => parseGetQuery(getQueryInvalid)).toThrow(
      ERROR_INVALID_SPRINTCODE
    );
  });
});
