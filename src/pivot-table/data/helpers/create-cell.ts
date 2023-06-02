import type { Cell, ExprColorIdx } from "../../../types/types";
import { resolveToRGBAorRGB } from "./color-utils";

const resolveExpressionColor = (node: EngineAPI.INxPivotDimensionCell, exprColorIdx: 0 | 1 | -1) => {
  const colorValue = (node.qAttrExps as unknown as EngineAPI.INxAttributeExpressionValues)?.qValues?.[exprColorIdx]
    ?.qText;

  return colorValue ? resolveToRGBAorRGB(colorValue) : undefined;
};

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  dataY: number,
  isSnapshot: boolean,
  exprColorIds: ExprColorIdx
): Cell => ({
  ref: node,
  x,
  y, // position of cell in page
  dataY, // position of cell in dataset
  parent,
  root,
  leafCount: isSnapshot ? 0 : node.qUp + node.qDown,
  foregroundColor: resolveExpressionColor(node, exprColorIds.foregroundColorIdx),
  backgroundColor: resolveExpressionColor(node, exprColorIds.backgroundColorIdx),
  distanceToNextCell: 0,
  incrementLeafCount() {
    this.leafCount += 1;
    if (parent) {
      parent.incrementLeafCount();
    }
  },
});

export default createCell;
