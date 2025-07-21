import { GiphyFetch } from '@giphy/js-fetch-api';
import {
  ERROR_FETCHING_GIF,
  GIPHY_SEARCH_CONFIG,
  GIPHY_SEARCH_TITLE,
} from '../constants';
import { GifNotFound } from '../errors';
import NotFound from '@/utils/errors/NotFound';

const { GIPHY_API_KEY } = process.env;

const defaultGf = new GiphyFetch(GIPHY_API_KEY!);

export const fetchRandomCelebrationGif = async (gf: GiphyFetch = defaultGf) => {
  try {
    const { data } = await gf.search(GIPHY_SEARCH_TITLE, GIPHY_SEARCH_CONFIG);

    if (data.length === 0) {
      throw new GifNotFound();
    }

    const randomGif = data[Math.floor(Math.random() * data.length)];
    return randomGif.images.fixed_height.url;
  } catch (error) {
    if (error instanceof NotFound) throw error;

    throw new Error(ERROR_FETCHING_GIF);
  }
};
