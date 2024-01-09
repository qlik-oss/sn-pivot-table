import type { List } from "../../../../types/types";

const getMeasureInfoIndex = (lastRowOrColumn: List, index: number) =>
  lastRowOrColumn?.[index]?.visibleMeasureInfoIndex ?? 0;

export default getMeasureInfoIndex;
