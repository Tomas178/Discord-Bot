export default class SprintAlreadyExists extends Error {
  constructor(code: string) {
    super(`Sprint with code ${code} already exists`);
    this.name = 'SprintAlreadyExistsError';
  }
}
