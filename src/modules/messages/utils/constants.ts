export const ERROR_EMPTY_MESSAGE = 'Message cannot be empty!';
export const ERROR_TOO_LONG_MESSAGE = 'Message too long!';
export const MAX_LENGTH_MESSAGE = 255;

export const MAX_LENGTH_USERNAME = 64;
export const ERROR_EMPTY_USERNAME = 'Username cannot be empty!';
export const ERROR_TOO_LONG_USERNAME = 'Username too long!';

export const ERROR_NO_TEMPLATES = 'No templates found!';
export const ERROR_NO_SPRINT = 'No sprint found!';

export const ERROR_FETCHING_GIF = 'Failed to fetch celebration GIF!';

export const FAKE_GIPHY_URL = 'https://giphy.com/fake.gif';

export const GIPHY_SEARCH_CONFIG = {
  limit: 15,
  rating: 'pg',
  type: 'gifs',
} as const;
export const GIPHY_SEARCH_TITLE = 'celebration';
