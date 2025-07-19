import { omit } from 'lodash/fp';
import {
  parse,
  parseId,
  parseInsertable,
  parseMessage,
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
} from './utils/constants';
import { date } from 'zod';

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
        /Sprint code must match the pattern/i
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

describe('parseInsertable', () => {
  it('Should omit id and createdAt', () => {
    const parsed = parseInsertable(fakeMessageFull());

    expect(parsed).not.toHaveProperty('id');
    expect(parsed).not.toHaveProperty('createdAt');
  });
});
