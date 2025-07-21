import { GiphyFetch } from '@giphy/js-fetch-api';
import { GifNotFound } from '../errors';
import {
  ERROR_FETCHING_GIF,
  FAKE_GIPHY_URL,
  GIPHY_SEARCH_CONFIG,
  GIPHY_SEARCH_TITLE,
} from '../constants';
import { fetchRandomCelebrationGif } from './giphyClient';

describe('fetchRandomCelebrationGif', () => {
  const mockSearch = vi.fn();
  const mockGiphyFetch = {
    search: mockSearch,
  } as unknown as GiphyFetch;

  beforeEach(() => {
    mockSearch.mockReset();
  });

  it('returns a GIF URL string when data exists', async () => {
    const mockGif = {
      images: {
        fixed_height: {
          url: FAKE_GIPHY_URL,
        },
      },
    };

    mockSearch.mockResolvedValue({ data: [mockGif] });

    const result = await fetchRandomCelebrationGif(mockGiphyFetch);
    expect(result).toBe(FAKE_GIPHY_URL);
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith(
      GIPHY_SEARCH_TITLE,
      GIPHY_SEARCH_CONFIG
    );
  });

  it('Throws an error if no GIFs are found', async () => {
    mockSearch.mockResolvedValue({ data: [] });

    await expect(fetchRandomCelebrationGif(mockGiphyFetch)).rejects.toThrow(
      new GifNotFound()
    );

    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith(
      GIPHY_SEARCH_TITLE,
      GIPHY_SEARCH_CONFIG
    );
  });

  it('Throws an internal server error', async () => {
    mockSearch.mockRejectedValue(new Error());

    await expect(fetchRandomCelebrationGif(mockGiphyFetch)).rejects.toThrow(
      new Error(ERROR_FETCHING_GIF)
    );

    expect(mockSearch).toHaveBeenCalledOnce();
    expect(mockSearch).toHaveBeenCalledWith(
      GIPHY_SEARCH_TITLE,
      GIPHY_SEARCH_CONFIG
    );
  });
});
