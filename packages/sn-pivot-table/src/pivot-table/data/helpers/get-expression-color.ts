import { COLORING, isDarkColor, toRGB } from "@qlik/nebula-table-utils/lib/utils";
import type { AttrExprInfoIndex } from "../../../types/types";

const getContrastingColor = (color: string | null, background: string | null) => {
  if (color || !background) {
    return null;
  }

  return isDarkColor(background) ? COLORING.WHITE : COLORING.TEXT;
};

const getExpressionColor = (
  attrsExprInfo: AttrExprInfoIndex,
  cell: EngineAPI.INxPivotValuePoint | EngineAPI.INxPivotDimensionCell,
) => {
  // Cast to object type as cell.qAttrExps is EngineAPI.INxAttributeExpressionValues | EngineAPI.INxAttributeExpressionValues[]
  const attrsExprValues = cell.qAttrExps as unknown as EngineAPI.INxAttributeExpressionValues;
  const expressionColor = attrsExprValues?.qValues?.[attrsExprInfo?.cellForegroundColor]?.qText;
  const expressionBackground = attrsExprValues?.qValues?.[attrsExprInfo?.cellBackgroundColor]?.qText;

  const background = expressionBackground ? toRGB(expressionBackground) : null;
  const color = expressionColor ? toRGB(expressionColor) : null;
  const contrastingColor = getContrastingColor(color, background);

  return {
    color: contrastingColor ?? color,
    background,
  };
};

export default getExpressionColor;
