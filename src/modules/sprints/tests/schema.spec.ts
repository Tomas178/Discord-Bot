import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeSprintFull } from './utils';

it('parses a valid record', () => {
  const record = fakeSprintFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing/wrong sprintCode', () => {
  const sprintWithoutSprintCode = omit(['sprintCode'], fakeSprintFull());
  const sprintWithEmptySprintCode = fakeSprintFull({
    sprintCode: '',
  });
  const sprintWithWrongSprintCode = fakeSprintFull({
    sprintCode: 'WD1.1',
  });

  expect(() => parse(sprintWithoutSprintCode)).toThrow(/sprintCode/i);
  expect(() => parse(sprintWithEmptySprintCode)).toThrow(/sprintCode/i);
  expect(() => parse(sprintWithWrongSprintCode)).toThrow(
    /Sprint code must match the pattern/i
  );
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
