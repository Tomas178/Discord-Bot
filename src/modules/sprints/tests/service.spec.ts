import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/record';
import buildService from '../service';
import { fakeSprint, fakeSprintFull, sprintMatcher } from './utils/utils';
import { INSERTABLE_SPRINTS, SPRINTS_FOR_UPDATE } from './utils/constants';
import { SprintAlreadyExists, SprintNotFound } from '../errors';

const db = await createTestDatabase();
const service = buildService(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('sprints').execute());

describe('findAll', () => {
  it('Should return all existing sprints', async () => {
    await createSprints(INSERTABLE_SPRINTS.map((sprint) => fakeSprint(sprint)));

    const sprints = await service.findAll();

    expect(sprints).toHaveLength(INSERTABLE_SPRINTS.length);
    expect(sprints).toEqual(
      INSERTABLE_SPRINTS.map((sprint) => sprintMatcher(sprint))
    );
  });
});

describe('createSprint', () => {
  it('Should throw a SprintAlreadyExists', async () => {
    const [sprint] = await createSprints(fakeSprint());

    await expect(service.createSprint(sprint)).rejects.toThrow(
      new SprintAlreadyExists(sprint.sprintCode)
    );
  });

  it('Should add one sprint', async () => {
    const sprint = await service.createSprint(fakeSprint());

    expect(sprint).toEqual(sprintMatcher());

    const sprintsInDatabase = await selectSprints();
    expect(sprintsInDatabase).toEqual([sprint]);
  });
});

describe('updateSprint', () => {
  it('Should throw a SprintNotFound', async () => {
    await expect(
      service.updateSprint(SPRINTS_FOR_UPDATE[0].id, {})
    ).rejects.toThrow(new SprintNotFound(SPRINTS_FOR_UPDATE[0].id));
  });

  it('Should throw a SprintAlreadyExists', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    await expect(
      service.updateSprint(sprint.id, { sprintCode: sprint.sprintCode })
    ).rejects.toThrow(new SprintAlreadyExists(sprint.sprintCode));
  });

  it('Should return same record as created if no values are given to update', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const updatedSprint = await service.updateSprint(sprint.id, {});

    expect(updatedSprint).toEqual(sprint);
  });

  it('Should update sprint', async () => {
    const [sprint] = await createSprints(fakeSprintFull());

    const updatedSprint = await service.updateSprint(sprint.id, {
      sprintCode: SPRINTS_FOR_UPDATE[0].sprintCode,
    });

    expect(updatedSprint).toEqual(
      sprintMatcher({ sprintCode: SPRINTS_FOR_UPDATE[0].sprintCode })
    );
  });
});

describe('remove', () => {
  it('Should throw a SprintNotFound', async () => {
    await expect(service.removeSprint(1)).rejects.toThrow(
      new SprintNotFound(1)
    );
  });

  it('Should remove sprint', async () => {
    const [addedSprint] = await createSprints(fakeSprint());

    const removedSprint = await service.removeSprint(addedSprint.id);

    expect(removedSprint).toEqual(addedSprint);
  });
});
