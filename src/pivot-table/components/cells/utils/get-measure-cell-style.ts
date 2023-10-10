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
    return { ...nilStyle, ...styleService.nullValue };
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
  const { fontFamily, fontSize } = styleService.content;
  const sharedStyle = {
    ...textStyle,
    ...(!isNumeric && getGridTextClampStyle(styleService.content.lineClamp)),
    ...(expressionColor && { color: expressionColor }),
    alignSelf: "flex-start",
    fontFamily,
    fontSize,
  };

  if (isNull) {
    const { fontWeight, fontStyle, textDecoration } = styleService.nullValue;
    return {
      ...sharedStyle,
      fontWeight,
      fontStyle,
      textDecoration,
    };
  }

  const { fontWeight, fontStyle, textDecoration } = styleService.content;

  return {
    ...sharedStyle,
    fontWeight: isTotalValue && fontWeight === undefined ? BOLD_FONT_WEIGHT : fontWeight,
    fontStyle,
    textDecoration,
  };
};
