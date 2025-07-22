import { omit } from 'lodash/fp';
import { parse, parseId, parseInsertable, parseUpdateable } from '../schema';
import { fakeSprintFull } from './utils/utils';
import { ERROR_INVALID_SPRINTCODE } from '../utils/constants';

describe('parse', () => {
  it('parses a valid record', () => {
    const record = fakeSprintFull();

    expect(parse(record)).toEqual(record);
  });

  it('throws an error due to empty sprintCode', () => {
    const sprintWithEmptySprintCode = fakeSprintFull({
      sprintCode: '',
    });

    expect(() => parse(sprintWithEmptySprintCode)).toThrow(/sprintCode/i);
  });

  it('throws an error due to missing sprintCode', () => {
    const sprintWithoutSprintCode = omit(['sprintCode'], fakeSprintFull());

    expect(() => parse(sprintWithoutSprintCode)).toThrow(/sprintCode/i);
  });

  it('throws an error due to invalid sprintCode', () => {
    const sprintWithInvalidSprintCode = fakeSprintFull({
      sprintCode: 'WD1.1',
    });
    expect(() => parse(sprintWithInvalidSprintCode)).toThrow(
      ERROR_INVALID_SPRINTCODE
    );
  });
});

describe('parseId', () => {
  it('parses a valid id', () => {
    const id = 1;

    expect(parseId(id)).toEqual(id);
  });

  it('throws an error for id which is float type', () => {
    const realValueId = 1.1;

    expect(() => parseId(realValueId)).toThrow(/expected int/i);
  });

  it('throws an error for id which is negative', () => {
    const negativeId = -1;

    expect(() => parseId(negativeId)).toThrow(/Too small/i);
  });
});

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
