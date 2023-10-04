import { COLORING, isDarkColor } from "@qlik/nebula-table-utils/lib/utils";
import type { AttrExprInfoIndex } from "../../../types/types";
import toRGB from "./to-rgb";

const getExpressionColor = (
  attrsExprInfo: AttrExprInfoIndex,
  cell: EngineAPI.INxPivotValuePoint | EngineAPI.INxPivotDimensionCell,
) => {
  const attrsExprValues = cell.qAttrExps as unknown as EngineAPI.INxAttributeExpressionValues;
  const expressionColor = attrsExprValues?.qValues?.[attrsExprInfo.foregroundColorIdx]?.qText;
  const expressionBackground = attrsExprValues?.qValues?.[attrsExprInfo.backgroundColorIdx]?.qText;

  const background = expressionBackground ? toRGB(expressionBackground) : null;
  const contrastingColor = !expressionColor && background && isDarkColor(background) ? COLORING.WHITE : null;
  const color = expressionColor ? toRGB(expressionColor) : null;

  return {
    color: contrastingColor ?? color,
    background,
  };
};

export default getExpressionColor;
