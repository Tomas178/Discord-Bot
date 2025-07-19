import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/record';
import { selectAllFor } from '../../../../tests/utils/record';
import { INSERTABLE_TEMPLATES, TEMPLATES_FOR_UPDATE } from './utils/constants';
import { fakeTemplate, fakeTemplateFull, templateMatcher } from './utils/utils';
import buildService from '../service';
import { TemplateAlreadyExists, TemplateNotFound } from '../errors';

const db = await createTestDatabase();
const service = buildService(db);
const createTemplates = createFor(db, 'templates');
const selectTemplates = selectAllFor(db, 'templates');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('templates').execute());

describe('findAll', () => {
  it('Should return all existing templates', async () => {
    await createTemplates(
      INSERTABLE_TEMPLATES.map((template) => fakeTemplate(template))
    );

    const templates = await service.findAll();

    expect(templates).toHaveLength(INSERTABLE_TEMPLATES.length);
    expect(templates).toEqual(
      INSERTABLE_TEMPLATES.map((template) => templateMatcher(template))
    );
  });
});

describe('createTemplate', () => {
  it('Should throw a TemplateAlreadyExists', async () => {
    const [createdTemplate] = await createTemplates(fakeTemplate());

    await expect(service.createTemplate(createdTemplate)).rejects.toThrow(
      new TemplateAlreadyExists(createdTemplate.templateMessage)
    );
  });

  it('Should add one template', async () => {
    const template = await service.createTemplate(fakeTemplate());

    expect(template).toEqual(templateMatcher());

    const templatesInDatabase = await selectTemplates();

    expect(templatesInDatabase).toEqual([template]);
  });
});

describe('updateTemplate', () => {
  it('Should throw a TemplateNotFound', async () => {
    await expect(
      service.updateTemplate(
        TEMPLATES_FOR_UPDATE[0].id,
        fakeTemplate(TEMPLATES_FOR_UPDATE[0])
      )
    ).rejects.toThrow(new TemplateNotFound(TEMPLATES_FOR_UPDATE[0].id));
  });

  it('Should throw a TemplateAlreadyExists', async () => {
    const [createdTemplate] = await createTemplates(fakeTemplate());

    await expect(
      service.updateTemplate(createdTemplate.id, {
        templateMessage: createdTemplate.templateMessage,
      })
    ).rejects.toThrow(
      new TemplateAlreadyExists(createdTemplate.templateMessage)
    );
  });

  it('Should return same record as created if no values are given to update', async () => {
    const [template] = await createTemplates(fakeTemplateFull());

    const updatedTemplate = await service.updateTemplate(template.id, {});

    expect(updatedTemplate).toEqual(template);
  });

  it('Should update template', async () => {
    const [template] = await createTemplates(fakeTemplateFull());

    const updatedTemplate = await service.updateTemplate(template.id, {
      templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage,
    });

    expect(updatedTemplate).toEqual(
      templateMatcher({
        templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage,
      })
    );
  });
});

describe('removeTemplate', () => {
  it('Should throw a TemplateNotFound', async () => {
    await expect(service.removeTemplate(1)).rejects.toThrow(
      new TemplateNotFound(1)
    );
  });

  it('Should remove template', async () => {
    const [addedTemplate] = await createTemplates(fakeTemplate());

    const removedSprint = await service.removeTemplate(addedTemplate.id);

    expect(removedSprint).toEqual(addedTemplate);
  });
});
