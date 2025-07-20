import { GiphyFetch } from '@giphy/js-fetch-api';

const { GIPHY_API_KEY } = process.env;

const defaultGf = new GiphyFetch(GIPHY_API_KEY!);

export const GIPHY_SEARCH_CONFIG = {
  limit: 15,
  rating: 'pg',
  type: 'gifs',
} as const;

export const fetchRandomCelebrationGif = async (gf: GiphyFetch = defaultGf) => {
  const { data } = await gf.search('celebration', GIPHY_SEARCH_CONFIG);

  if (data.length === 0) {
    throw new Error('No celebration GIFs found');
  }

  const randomGif = data[Math.floor(Math.random() * data.length)];
  return randomGif.images.fixed_height.url;
};
