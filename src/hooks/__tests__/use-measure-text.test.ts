import { renderHook, act } from '@testing-library/react-hooks';
import useMeasureText from '../use-measure-text';

jest.mock('../use-data-model');

describe('useMeasureText', () => {
  let measureTextMock: jest.Mock<{ width: number }>;

  beforeEach(() => {
    measureTextMock = jest.fn();
    const context = {
      measureText: measureTextMock
    } as unknown as CanvasRenderingContext2D;
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('estimateWidth', () => {
    test('should estimate width', () => {
      measureTextMock.mockReturnValue({ width: 150 });
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateWidth(2)).toBe(300);
    });

    test('should have a minimum width limit', () => {
      measureTextMock.mockReturnValue({ width: 1 });
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateWidth(2)).toBe(100);
    });
  });

  describe('measureText', () => {
    test('should measure width', () => {
      measureTextMock.mockReturnValue({ width: 150 });
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.measureText('some string')).toBe(175);
    });
  });
});
