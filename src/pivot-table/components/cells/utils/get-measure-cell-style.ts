import type { ExtendedMeasureInfo } from "../../../../types/QIX";
import type { Flags, StyleService } from "../../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../../constants";
import { getLineClampStyle, textStyle } from "../../shared-styles";
import resolveTextAlign from "./resolve-text-align";

const numericStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "100%",
};

const nilStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  height: "100%",
  backgroundClip: "padding-box",
};

export const getCellStyle = (
  styleService: StyleService,
  isNull: boolean,
  isTotalValue: boolean,
  expressionBackground: string | null,
) => {
  if (isNull) {
    return { ...nilStyle, ...styleService.nullValues };
  }

  if (isTotalValue) {
    return {
      ...numericStyle,
      color: styleService.totalValues.color,
      background: expressionBackground ?? styleService.totalValues.background,
    };
  }

  return {
    ...numericStyle,
    color: styleService.measureValues.color,
    background: expressionBackground ?? styleService.measureValues.background,
  };
};

export const getTextStyle = (
  styleService: StyleService,
  expressionColor: string | null,
  isNumeric: boolean,
  isTotalValue: boolean,
  isNull: boolean,
) => {
  const { fontFamily, fontSize } = styleService.measureValues;
  const sharedStyle = {
    ...textStyle,
    ...(!isNumeric && getLineClampStyle(styleService.grid.lineClamp)),
    ...(expressionColor && { color: expressionColor }),
    alignSelf: "flex-start",
    fontFamily,
    fontSize,
  };

  if (isNull) {
    const { fontWeight, fontStyle, textDecoration } = styleService.nullValues;
    return {
      ...sharedStyle,
      fontWeight,
      fontStyle,
      textDecoration,
    };
  }

  if (isTotalValue) {
    const { fontWeight, fontStyle, textDecoration } = styleService.totalValues;
    return {
      ...sharedStyle,
      fontWeight,
      fontStyle,
      textDecoration,
    };
  }

  const { fontWeight, fontStyle, textDecoration } = styleService.measureValues;

  return {
    ...sharedStyle,
    fontWeight: fontWeight === undefined ? BOLD_FONT_WEIGHT : fontWeight,
    fontStyle,
    textDecoration,
  };
};

export const getTextAlign = (measureInfo: ExtendedMeasureInfo, isNumeric: boolean, flags: Flags) => {
  const { textAlign } = measureInfo;
  const defaultAlign = isNumeric ? "flex-end" : "center";

  return resolveTextAlign(textAlign, defaultAlign, flags);
};
