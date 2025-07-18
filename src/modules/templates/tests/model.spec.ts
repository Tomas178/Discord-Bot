import createTestDatabase from '@tests/utils/createTestDatabase';
import buildModel from '../model';
import { createFor, selectAllFor } from '@tests/utils/record';
import { fakeTemplate, templateMatcher } from './utils/utils';
import { INSERTABLE_TEMPLATES, TEMPLATES_FOR_UPDATE } from './utils/constants';

const db = await createTestDatabase();
const model = buildModel(db);
const createTemplates = createFor(db, 'templates');
const selectTemplates = selectAllFor(db, 'templates');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('templates').execute());

describe('findAll', () => {
  it('Should return all existing templates', async () => {
    await createTemplates([
      ...INSERTABLE_TEMPLATES.map((template) => fakeTemplate(template)),
    ]);

    const templates = await model.findAll();

    expect(templates).toHaveLength(INSERTABLE_TEMPLATES.length);
    expect(templates[0]).toEqual(templateMatcher(INSERTABLE_TEMPLATES[0]));
    expect(templates[1]).toEqual(templateMatcher(INSERTABLE_TEMPLATES[1]));
    expect(templates[2]).toEqual(templateMatcher(INSERTABLE_TEMPLATES[2]));
  });
});

describe('findById', () => {
  it('Should return undefined', async () => {
    const template = await model.findById(999);

    expect(template).toBeUndefined();
  });

  it('Should return template', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const templateInDatabase = await model.findById(template.id);

    expect(templateInDatabase).toEqual(template);
  });
});

describe('create', () => {
  it('Should add one template', async () => {
    const template = await model.create(fakeTemplate());

    expect(template).toEqual(templateMatcher());

    const templateInDatabase = await selectTemplates();

    expect(templateInDatabase).toEqual([template]);
  });
});

describe('update', () => {
  it('Should return same template as before update', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const updatedTemplate = await model.update(template.id, {});

    expect(updatedTemplate).toMatchObject(templateMatcher());
  });

  it('Should return undefined', async () => {
    const updatedTemplate = await model.update(999, {});

    expect(updatedTemplate).toBeUndefined();
  });

  it('Should update template', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const updatedTemplate = await model.update(template.id, {
      templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage,
    });

    expect(updatedTemplate).toMatchObject(
      templateMatcher({
        templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage,
      })
    );
  });
});

describe('remove', () => {
  it('Should return undefined', async () => {
    const removedTemplate = await model.remove(999);

    expect(removedTemplate).toBeUndefined();
  });

  it('Should delete template', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const removedTemplate = await model.remove(template.id);

    expect(removedTemplate).toEqual(templateMatcher());
  });
});
