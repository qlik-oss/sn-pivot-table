import createHeadersData from '../headers-data';
import extractHeaders from '../extract-headers';

jest.mock('../extract-headers');
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe('create headers data', () => {
  const qHyperCube = { qDimensionInfo: [] } as unknown as EngineAPI.IHyperCube;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return correct headers data', () => {
    const headers = [['a', 'b']];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(qHyperCube, 1, [0, 1]);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(1);
    expect(headersData.size.y).toBe(2);
  });

  test('should handle when there are no headers', () => {
    const headers = [] as string[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(qHyperCube, 1, [0, 1]);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(0);
  });
});
