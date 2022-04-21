import { renderHook, act } from '@testing-library/react-hooks';
import { NxSelectionCellType } from '../../../types/QIX';
import { ExtendedSelections } from '../../../types/types';
import useSelectionsModel from '../use-selections-model';

describe('useSelectionsModel', () => {
  let selections: ExtendedSelections;

  beforeEach(() => {
    selections = {
      on: () => {},
      removeListener: () => {},
      select: () => {},
      isActive: () => false,
      begin: () => {},
    } as unknown as ExtendedSelections;

    jest.spyOn(selections, 'on');
    jest.spyOn(selections, 'removeListener');
    jest.spyOn(selections, 'select');
    jest.spyOn(selections, 'isActive');
    jest.spyOn(selections, 'begin');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should add and remove event listeners', () => {
    const { unmount } = renderHook(() => useSelectionsModel(selections));

    expect(selections.on).toHaveBeenCalledWith('deactivated', expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith('canceled', expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith('confirmed', expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith('cleared', expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledTimes(0);

    unmount();

    expect(selections.removeListener).toHaveBeenCalledWith('deactivated', expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith('canceled', expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith('confirmed', expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith('cleared', expect.any(Function));
  });

  test('should select cell and call begin selection', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 1, 2)();
    });

    expect(selections.begin).toHaveBeenCalled();
    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0 ,1 )).toBeTruthy();
    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 1 ,2 )).toBeTruthy();
  });

  test('should select cell and not call begin selection when already active', () => {
    selections.isActive = () => true;
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(selections.begin).toHaveBeenCalledTimes(0);
    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0 ,1 )).toBeTruthy();
  });

  test('should de-select cell', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0 ,1 )).toBeTruthy();

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0 ,1 )).toBeFalsy();
  });

  test('should not select lock cell type', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0 ,1 )).toBeTruthy();

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 1)();
    });

    expect(result.current.isSelected(NxSelectionCellType.NX_CELL_LEFT, 0 ,1 )).toBeFalsy();
  });

  test('should lock cells with qType=T when qType=L is already selected', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 1)();
    });

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy();
    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeFalsy();
  });

  test('should lock cells with qType=T and not on the same row', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy();
    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 1, 1)).toBeTruthy();
  });

  test('should lock cells with qType=L when qType=T is already selected', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)();
    });

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeTruthy();
    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy();
  });

  test('should lock cells with qType=L and not on the same column', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    act(() => {
      result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 0)();
    });

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 0)).toBeFalsy();
    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeTruthy();
  });

  test('should not lock unknown cell type', () => {
    const { result } = renderHook(() => useSelectionsModel(selections));

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_DATA, 0, 0)).toBeFalsy();
  });
});
