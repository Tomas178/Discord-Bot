import createApp from '@/app';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/record';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { INSERTABLE_TEMPLATES, TEMPLATES_FOR_UPDATE } from './utils/constants';
import { fakeTemplate, fakeTemplateFull, templateMatcher } from './utils/utils';
import { omit } from 'lodash/fp';
import { ERROR_MISSING_TEMPLATE_MESSAGE } from '../utils/constants';

const db = await createTestDatabase();
const app = createApp(db);

const createTemplates = createFor(db, 'templates');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('templates').execute());

describe('Route /templates', () => {
  describe('GET', () => {
    it('Should return 200 and an empty array when there are no templates', async () => {
      const { body } = await supertest(app)
        .get('/templates')
        .expect(StatusCodes.OK);

      expect(body).toEqual([]);
    });

    it('Should return 200 and all templates', async () => {
      await createTemplates(
        INSERTABLE_TEMPLATES.map((template) => fakeTemplate(template))
      );

      const { body } = await supertest(app)
        .get('/templates')
        .expect(StatusCodes.OK);

      expect(body).toHaveLength(INSERTABLE_TEMPLATES.length);
      expect(body).toEqual(
        INSERTABLE_TEMPLATES.map((template) => templateMatcher(template))
      );
    });
  });

  describe('POST', () => {
    it('Should return 400 if the templateMessage is missing', async () => {
      const { body } = await supertest(app)
        .post('/templates')
        .send(omit(['templateMessage'], fakeTemplate()))
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toMatch(/templateMessage/i);
    });

    it('Should return 409 if the templateMessage already exists in the database', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .post('/templates')
        .send(template)
        .expect(StatusCodes.CONFLICT);

      expect(body.error.message).toMatch(/Template with this message/i);
    });

    it('Should return 201 and post template', async () => {
      const template = fakeTemplate();

      const { body } = await supertest(app)
        .post('/templates')
        .send(template)
        .expect(StatusCodes.CREATED);

      expect(body).toEqual(templateMatcher());
    });
  });

  describe('PATCH', () => {
    it('Should return 400 if the templateMessage is missing', async () => {
      const { body } = await supertest(app)
        .patch('/templates?id=1')
        .send(omit(['templateMessage'], INSERTABLE_TEMPLATES[0]))
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toEqual(ERROR_MISSING_TEMPLATE_MESSAGE);
    });

    it('Should return 400 if the is not given in the query', async () => {
      const { body } = await supertest(app)
        .patch('/templates')
        .send(fakeTemplate())
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toMatch(/Expected number/i);
    });

    it('Should return 404 is the template is missing', async () => {
      const { body } = await supertest(app)
        .patch('/templates?id=1')
        .send(fakeTemplate())
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Template with id/i);
    });

    it('Should return 409 if the new templateMessage already exists', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .patch(`/templates?id=${template.id}`)
        .send(template)
        .expect(409);

      expect(body.error.message).toMatch(/template with this message/i);
    });

    it('Should return 200 and patch template', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .patch(`/templates?id=${template.id}`)
        .send({ templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage })
        .expect(StatusCodes.OK);

      expect(body).toEqual(
        templateMatcher({ ...TEMPLATES_FOR_UPDATE[0], id: template.id })
      );
    });
  });

  describe('DELETE', () => {
    it('Should return 400 if the is not given in the query', async () => {
      const { body } = await supertest(app)
        .delete('/templates')
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toMatch(/Expected number/i);
    });

    it('Should return 404 if the template is not found', async () => {
      const { body } = await supertest(app)
        .delete('/templates?id=1')
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Template with id/i);
    });

    it('Should return 200 and delete the template', async () => {
      const [template] = await createTemplates(fakeTemplateFull());

      const { body } = await supertest(app)
        .delete(`/templates?id=${template.id}`)
        .expect(StatusCodes.OK);

      expect(body).toEqual(template);
    });
  });

  describe('Method Not Allowed', () => {
    it('Should return 405 for unsupported methods like PUT', async () => {
      const { body } = await supertest(app)
        .put('/templates')
        .send({})
        .expect(StatusCodes.METHOD_NOT_ALLOWED);

      expect(body.error.message).toMatch(/method not allowed/i);
    });
  });
});

describe('Route /templates/:id', () => {
  describe('GET', () => {
    it('Should return 404 and throw an error TemplateNotFound', async () => {
      const { body } = await supertest(app)
        .get('/templates/999')
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Template with id/i);
    });

    it('Should return 200 and template by given id', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .get(`/templates/${template.id}`)
        .expect(StatusCodes.OK);

      expect(body).toStrictEqual(template);
    });
  });

  describe('PATCH', () => {
    it('Should return 400 if the templateMessage is missing', async () => {
      const { body } = await supertest(app)
        .patch('/templates/1')
        .send(omit(['templateMessage'], INSERTABLE_TEMPLATES[0]))
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toEqual(ERROR_MISSING_TEMPLATE_MESSAGE);
    });

    it('Should return 400 if the id is not valid', async () => {
      const { body } = await supertest(app)
        .patch('/templates/string')
        .send(fakeTemplate())
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toMatch(/Expected number/i);
    });

    it('Should return 404 is the template is missing', async () => {
      const { body } = await supertest(app)
        .patch('/templates/1')
        .send(fakeTemplate())
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Template with id/i);
    });

    it('Should return 409 if the new templateMessage already exists', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .patch(`/templates/${template.id}`)
        .send(template)
        .expect(409);

      expect(body.error.message).toMatch(/template with this message/i);
    });

    it('Should return 200 and patch template', async () => {
      const [template] = await createTemplates(fakeTemplate());

      const { body } = await supertest(app)
        .patch(`/templates/${template.id}`)
        .send({ templateMessage: TEMPLATES_FOR_UPDATE[0].templateMessage })
        .expect(StatusCodes.OK);

      expect(body).toEqual(
        templateMatcher({ ...TEMPLATES_FOR_UPDATE[0], id: template.id })
      );
    });
  });

  describe('DELETE', () => {
    it('Should return 400 if the id is invalid', async () => {
      const { body } = await supertest(app)
        .delete('/templates/string')
        .expect(StatusCodes.BAD_REQUEST);

      expect(body.error.message).toMatch(/Expected number/i);
    });

    it('Should return 404 if the template is not found', async () => {
      const { body } = await supertest(app)
        .delete('/templates/1')
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Template with id/i);
    });

    it('Should return 200 and delete the template', async () => {
      const [template] = await createTemplates(fakeTemplateFull());

      const { body } = await supertest(app)
        .delete(`/templates/${template.id}`)
        .expect(StatusCodes.OK);

      expect(body).toEqual(template);
    });
  });

  describe('Method Not Allowed', () => {
    it('Should return 405 for unsupported methods like PUT', async () => {
      const { body } = await supertest(app)
        .put('/templates')
        .send({})
        .expect(StatusCodes.METHOD_NOT_ALLOWED);

      expect(body.error.message).toMatch(/method not allowed/i);
    });
  });
});
