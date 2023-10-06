import type { StyleService } from "../../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../../constants";
import { getLineClampStyle, textStyle } from "../../shared-styles";

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

export const containerStyle: React.CSSProperties = {
  justifyContent: "center",
};

const getGridTextClampStyle = (clampCount: number): React.CSSProperties => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  ...getLineClampStyle(clampCount),
});

export const getCellStyle = (
  styleService: StyleService,
  isNull: boolean,
  isTotalValue: boolean,
  expressionBackground: string | null,
) => {
  if (isNull) {
    return { ...nilStyle, ...styleService.content.nullValue };
  }

  if (isTotalValue) {
    return {
      ...numericStyle,
      color: styleService.content.totalValue.color,
      background: expressionBackground ?? styleService.content.totalValue.background,
    };
  }

  return {
    ...numericStyle,
    color: styleService.content.color,
    background: expressionBackground ?? styleService.content.background,
  };
};

export const getTextStyle = (
  styleService: StyleService,
  expressionColor: string | null,
  isNumeric: boolean,
  isTotalValue: boolean,
  isNull: boolean,
) => {
  const { fontFamily, fontSize, fontWeight, fontStyle, textDecoration } = styleService.content;
  const omitFontStyling = isTotalValue || isNull;
  let cellFontWeight = fontWeight;

  if (isTotalValue) {
    cellFontWeight = BOLD_FONT_WEIGHT;
  } else if (isNull) {
    cellFontWeight = "normal";
  }

  return {
    ...textStyle,
    ...(!isNumeric && getGridTextClampStyle(styleService.content.lineClamp)),
    ...(expressionColor && { color: expressionColor }),
    alignSelf: "flex-start",
    fontFamily,
    fontSize,
    fontWeight: cellFontWeight,
    fontStyle: omitFontStyling ? undefined : fontStyle,
    textDecoration: omitFontStyling ? undefined : textDecoration,
  };
};
