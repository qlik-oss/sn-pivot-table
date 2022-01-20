declare module 'react-window';

interface VariableSizeGrid {
  resetAfterColumnIndex: (index: number, shouldForceUpdate: boolean = true) => void;
  resetAfterIndices: (options: { columnIndex: number, rowIndex: number, shouldForceUpdate: boolean = true }) => void;
  scrollToItem: (options: { align: string = "auto"; columnIndex?: number; rowIndex?: number; }) => void;
}

interface OnItemsRenderedProps {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}
