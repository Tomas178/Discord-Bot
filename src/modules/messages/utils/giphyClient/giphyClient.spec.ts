import { fetchRandomCelebrationGif, GIPHY_SEARCH_CONFIG } from './giphyClient';

describe('fetchRandomCelebrationGif with DI', () => {
  const mockSearch = vi.fn();
  const mockGiphyFetch = {
    search: mockSearch,
  };

  beforeEach(() => {
    mockSearch.mockReset();
  });

  it('returns a GIF URL string when data exists', async () => {
    const mockGif = {
      images: {
        fixed_height: {
          url: 'https://giphy.com/fake.gif',
        },
      },
    };

    mockSearch.mockResolvedValue({ data: [mockGif] });

    const result = await fetchRandomCelebrationGif(mockGiphyFetch as any);
    expect(result).toBe('https://giphy.com/fake.gif');
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith('celebration', GIPHY_SEARCH_CONFIG);
  });

  it('throws an error if no GIFs are found', async () => {
    mockSearch.mockResolvedValue({ data: [] });

    await expect(
      fetchRandomCelebrationGif(mockGiphyFetch as any)
    ).rejects.toThrow('No celebration GIFs found');
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith('celebration', GIPHY_SEARCH_CONFIG);
  });
});
