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
  pageY: number,
  isSnapshot: boolean,
  exprColorIds: ExprColorIdx
): Cell => ({
  ref: node,
  x,
  y,
  // pageX might change to reflect x in current x axis page
  // when we implement horizontal pagination feature (exactly like the relation btw y and pageY)
  pageX: x,
  pageY,
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
