import type { List } from "../../../../types/types";

const getMeasureInfoIndex = (lastRowOrColumn: List, index: number) =>
  // When a cell does not have a visibleMeasureInfoIndex, we assume that it's because
  // there are no pseudo dimensions.
  lastRowOrColumn?.[index]?.visibleMeasureInfoIndex ?? 0;

export default getMeasureInfoIndex;
