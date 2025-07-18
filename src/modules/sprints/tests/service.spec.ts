import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/record';
import buildService from '../service';
import { fakeSprint, fakeSprintFull, sprintMatcher } from './utils/utils';
import { INSERTABLE_SPRINTS, SPRINT_CODES_FOR_UPDATE } from './utils/constants';
import { SprintAlreadyExists, SprintNotFound } from '../errors';

const db = await createTestDatabase();
const service = buildService(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('sprints').execute());

describe('findAll', () => {
  it('Should return all existing sprints', async () => {
    await createSprints([
      fakeSprint(INSERTABLE_SPRINTS[0]),
      fakeSprint(INSERTABLE_SPRINTS[1]),
      fakeSprint(INSERTABLE_SPRINTS[2]),
    ]);

    const sprints = await service.findAll();

    expect(sprints).toHaveLength(3);
    expect(sprints[0]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[0]));
    expect(sprints[1]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[1]));
    expect(sprints[2]).toEqual(sprintMatcher(INSERTABLE_SPRINTS[2]));
  });
});

describe('createSprint', () => {
  it('Should throw a SprintAlreadyExists', async () => {
    createSprints(fakeSprint(INSERTABLE_SPRINTS[0]));

    await expect(service.createSprint(INSERTABLE_SPRINTS[0])).rejects.toThrow(
      new SprintAlreadyExists(INSERTABLE_SPRINTS[0].sprintCode)
    );
  });

  it('Should add one sprint', async () => {
    const sprint = await service.createSprint(INSERTABLE_SPRINTS[0]);

    expect(sprint).toEqual(sprintMatcher(INSERTABLE_SPRINTS[0]));

    const sprintsInDatabase = await selectSprints();
    expect(sprintsInDatabase).toEqual([sprint]);
  });
});

describe('updateSprint', () => {
  it('Should throw a SprintNotFound', async () => {
    await expect(
      service.updateSprint(INSERTABLE_SPRINTS[0].sprintCode, {})
    ).rejects.toThrow(new SprintNotFound(INSERTABLE_SPRINTS[0].sprintCode));
  });

  it('Should return same record as created if not values are given to update', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const updatedSprint = await service.updateSprint(sprint.sprintCode, {});

    expect(updatedSprint).toEqual(sprint);
  });
});

describe('remove', () => {
  it('Should throw a SprintNotFound', async () => {
    await expect(
      service.removeSprint(INSERTABLE_SPRINTS[0].sprintCode)
    ).rejects.toThrow(new SprintNotFound(INSERTABLE_SPRINTS[0].sprintCode));
  });

  it('Should remove sprint', async () => {
    await createSprints(fakeSprint(INSERTABLE_SPRINTS[0]));

    const removedSprint = await service.removeSprint(
      INSERTABLE_SPRINTS[0].sprintCode
    );

    expect(removedSprint).toEqual(sprintMatcher(INSERTABLE_SPRINTS[0]));
  });
});
