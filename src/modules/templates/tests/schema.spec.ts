import { omit } from 'lodash/fp';
import { parse, parseId, parseInsertable, parseUpdateable } from '../schema';
import { fakeTemplateFull } from './utils/utils';
import {
  ERROR_EMPTY_TEMPLATE_MESSAGE,
  ERROR_TOO_LONG_TEMPLATE_MESSAGE,
  MAX_LENGTH,
} from './utils/constants';

describe('parse', () => {
  it('Should parse a valid record', () => {
    const record = fakeTemplateFull();

    expect(parse(record)).toEqual(record);
  });

  it('Should throw an error due to empty templateMessage', () => {
    const templateWithEmptyTemplateMessage = fakeTemplateFull({
      templateMessage: '',
    });

    expect(() => parse(templateWithEmptyTemplateMessage)).toThrow(
      ERROR_EMPTY_TEMPLATE_MESSAGE
    );
  });

  it('Should throw an error due to missing templateMessage', () => {
    const templateWithMissingTemplateMessage = omit(
      ['templateMessage'],
      fakeTemplateFull()
    );

    expect(() => parse(templateWithMissingTemplateMessage)).toThrow(
      /templateMessage/i
    );
  });

  it('Should throw an error due to too long templateMessage', () => {
    const templateWithTooLongTemplateMessage = fakeTemplateFull({
      templateMessage: 'a'.repeat(MAX_LENGTH + 1),
    });

    expect(() => parse(templateWithTooLongTemplateMessage)).toThrow(
      ERROR_TOO_LONG_TEMPLATE_MESSAGE
    );
  });
});

describe('parseId', () => {
  it('Should parse a valid ID', () => {
    const validId = 1;

    expect(parseId(validId)).toEqual(validId);
  });

  it('Should throw an error for id which is float type', () => {
    const realValueId = 1.1;

    expect(() => parseId(realValueId)).toThrow(/expected int/i);
  });

  it('Should throw an error for id which is negative', () => {
    const negativeId = -1;

    expect(() => parseId(negativeId)).toThrow(/Too small/i);
  });
});

describe('parseInsertable', () => {
  it('Should omit id', () => {
    const record = parseInsertable(fakeTemplateFull());

    expect(record).not.toHaveProperty('id');
  });

  it('Should parse a valid record', () => {
    const record = omit(['id'], fakeTemplateFull());

    expect(parseInsertable(record)).toEqual(record);
  });
});

describe('parseUpdateable', () => {
  it('Should omit id', () => {
    const record = parseUpdateable(fakeTemplateFull());

    expect(record).not.toHaveProperty('id');
  });

  it('Should parse a valid record', () => {
    const record = omit(['id'], fakeTemplateFull());

    expect(parseUpdateable(record)).toEqual(record);
  });
});
