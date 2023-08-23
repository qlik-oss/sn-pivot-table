import type { StyleService } from "../../../../types/types";
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

export const getCellStyle = (styleService: StyleService, isNull: boolean, isTotalCell: boolean) => {
  if (isNull) {
    return { ...nilStyle, ...styleService.content.nullValue };
  }

  if (isTotalCell) {
    return {
      ...numericStyle,
      color: styleService.content.totalValue.color,
      background: styleService.content.totalValue.background,
      fontWeight: "600",
    };
  }

  return {
    ...numericStyle,
    color: styleService.content.color,
    background: styleService.content.background,
  };
};

export const getTextStyle = (styleService: StyleService, isNumeric: boolean) => {
  const { fontFamily, fontSize } = styleService.content;

  return {
    ...textStyle,
    ...(!isNumeric && getGridTextClampStyle(styleService.lineClamp)),
    alignSelf: "flex-start",
    fontFamily,
    fontSize,
  };
};