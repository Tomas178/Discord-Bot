import createTestDatabase from '@tests/utils/createTestDatabase';
import buildModel from '../model';
import { createFor, selectAllFor } from '@tests/utils/record';
import { INSERTABLE_SPRINTS, SPRINT_CODES_FOR_UPDATE } from './constants';
import { fakeSprint, fakeSprintFull, sprintMatcher } from './utils';

const db = await createTestDatabase();
const model = buildModel(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => await db.deleteFrom('sprints').execute());

describe('findAll', () => {
  it('Should return all existing sprints', async () => {
    await createSprints([
      fakeSprint(INSERTABLE_SPRINTS[0]),
      fakeSprint(INSERTABLE_SPRINTS[1]),
      fakeSprint(INSERTABLE_SPRINTS[2]),
    ]);

    const sprints = await model.findAll();

    expect(sprints).toHaveLength(3);
    expect(sprints[0]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[0]));
    expect(sprints[1]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[1]));
    expect(sprints[2]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[2]));
  });
});

describe('findBySprintCode', () => {
  it('Should return sprint by given sprintCode', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const sprintInDatabse = await model.findBySprintCode(sprint.sprintCode);
    expect(sprintInDatabse).toEqual(sprint);
  });

  it('Should return undefined if sprint is not found', async () => {
    const sprintInDatabase = await model.findBySprintCode('TP-1.1');
    expect(sprintInDatabase).toBeUndefined();
  });
});

describe('create', () => {
  it('Should add one sprint', async () => {
    const sprint = await model.create(INSERTABLE_SPRINTS[0]);

    expect(sprint).toEqual(sprintMatcher(INSERTABLE_SPRINTS[0]));

    const sprintsInDatabase = await selectSprints();
    expect(sprintsInDatabase).toEqual([sprint]);
  });
});

describe('update', () => {
  it('Should update a sprint', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const updatedSprint = await model.update(sprint.id, {
      sprintCode: SPRINT_CODES_FOR_UPDATE[0],
    });

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintCode: SPRINT_CODES_FOR_UPDATE[0],
      })
    );
  });

  it('Should return same record as created if not values are given to update', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const updatedSprint = await model.update(sprint.id, {});

    expect(updatedSprint).toEqual(sprint);
  });

  it('Should return undefined if sprint is not found', async () => {
    const updatedSprint = await model.update(999, {});

    expect(updatedSprint).toBeUndefined();
  });

  it('S');
});

describe('remove', () => {
  it('Should remove a sprint', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const removedSprint = await model.remove(sprint.id);

    expect(removedSprint).toEqual(sprintMatcher());
  });

  it('Should return undefined if sprint is not found', async () => {
    const removedSprint = await model.remove(999);

    expect(removedSprint).toBeUndefined();
  });
});
