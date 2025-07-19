import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import createApp from '@/app';
import { createFor } from '@tests/utils/record';
import { fakeSprint, fakeSprintFull, sprintMatcher } from './utils/utils';
import { INSERTABLE_SPRINTS, SPRINTS_FOR_UPDATE } from './utils/constants';
import { omit } from 'lodash/fp';
import { StatusCodes } from 'http-status-codes';

const db = await createTestDatabase();
const app = createApp(db);

const createSprints = createFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => await db.deleteFrom('sprints').execute());

describe('GET', () => {
  it('Should return 200 and an empty array when there are no sprints', async () => {
    const { body } = await supertest(app)
      .get('/sprints')
      .expect(StatusCodes.OK);

    expect(body).toEqual([]);
  });

  it('Should return 200 and all sprints', async () => {
    await createSprints(INSERTABLE_SPRINTS.map((sprint) => fakeSprint(sprint)));

    const { body } = await supertest(app)
      .get('/sprints')
      .expect(StatusCodes.OK);

    expect(body).toEqual(
      INSERTABLE_SPRINTS.map((sprint) => sprintMatcher(sprint))
    );
  });
});

describe('POST', () => {
  it('Should return 400 if the sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintCode'], fakeSprint()))
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('Should return 409 if the sprintCode already exists in the database', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const { body } = await supertest(app)
      .post('/sprints')
      .send(sprint)
      .expect(StatusCodes.CONFLICT);

    expect(body.error.message).toMatch(/Sprint with sprintCode/i);
  });

  it('Should return 201 and post sprint', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint())
      .expect(StatusCodes.CREATED);

    expect(body).toEqual(sprintMatcher());
  });
});

describe('PATCH', () => {
  it('Should return 400 if the sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .patch('/sprints?id=1')
      .send(omit(['sprintCode'], fakeSprint()))
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('Should return 400 if the id is not given in query', async () => {
    const { body } = await supertest(app)
      .patch('/sprints')
      .send(SPRINTS_FOR_UPDATE[0])
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/expected number/i);
  });

  it('Should return 404 if the sprint is missing', async () => {
    const { body } = await supertest(app)
      .patch('/sprints?id=1')
      .send(SPRINTS_FOR_UPDATE[0])
      .expect(StatusCodes.NOT_FOUND);

    expect(body.error.message).toMatch(/Sprint with id/i);
  });

  it('Should return 409 if the new sprintCode already exists', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const { body } = await supertest(app)
      .patch(`/sprints?id=${sprint.id}`)
      .send(sprint)
      .expect(409);

    expect(body.error.message).toMatch(/Sprint with sprintCode/i);
  });

  it('Should return 200 and patch sprint', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const { body } = await supertest(app)
      .patch(`/sprints?id=${sprint.id}`)
      .send({ sprintCode: SPRINTS_FOR_UPDATE[0].sprintCode })
      .expect(StatusCodes.OK);

    expect(body).toEqual(
      sprintMatcher({ ...SPRINTS_FOR_UPDATE[0], id: sprint.id })
    );
  });
});

describe('DELETE', () => {
  it('Should return 400 if the id is not given in query', async () => {
    const { body } = await supertest(app)
      .delete('/sprints')
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/expected number/i);
  });

  it('Should return 404 if sprint if not found', async () => {
    const { body } = await supertest(app)
      .delete('/sprints?id=1')
      .expect(StatusCodes.NOT_FOUND);

    expect(body.error.message).toMatch(/Sprint with id/i);
  });

  it('Should return 200 and delete the sprint', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const { body } = await supertest(app)
      .delete(`/sprints?id=${sprint.id}`)
      .expect(StatusCodes.OK);

    expect(body).toEqual(sprint);
  });
});

describe('Method Not Allowed', () => {
  it('Should return 405 for unsupported methods like PUT', async () => {
    const { body } = await supertest(app)
      .put('/sprints')
      .send({})
      .expect(StatusCodes.METHOD_NOT_ALLOWED);

    expect(body.error.message).toMatch(/method not allowed/i);
  });
});
