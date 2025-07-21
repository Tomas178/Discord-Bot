export const ERROR_TOO_LONG_TEMPLATE_MESSAGE =
  'Template message must be 255 characters or fewer';

export const ERROR_MISSING_TEMPLATE_MESSAGE = 'templateMessage is required';
export const MAX_LENGTH = 255;

export const TEMPLATE_REGEX = new RegExp(
  /{username} has just completed {sprintTitle}!\s+.+/
);

export const ERROR_INVALID_TEMPLATE_MESSAGE =
  '{username} has just completed {sprintTitle}! any sentence';
