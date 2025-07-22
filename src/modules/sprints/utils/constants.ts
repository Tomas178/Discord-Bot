export const sprintCodeRegex = new RegExp(/^[A-Z]+-\d+\.\d+$/);
export const ERROR_INVALID_SPRINTCODE =
  'Sprint code must match the pattern: Course-Module.Sprint (e.g., WD-1.1) ';

export const ERROR_EMPTY_SPRINT_TITLE = 'sprintTitle is empty!';
export const ERROR_PATCH_REQUEST = 'sprintCode or sprintTitle is required!';
