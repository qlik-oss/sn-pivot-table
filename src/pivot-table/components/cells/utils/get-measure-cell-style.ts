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

export const getCellStyle = (styleService: StyleService, isNull: boolean, isTotalValue: boolean) => {
  if (isNull) {
    return { ...nilStyle, ...styleService.content.nullValue };
  }

  if (isTotalValue) {
    return {
      ...numericStyle,
      color: styleService.content.totalValue.color,
      background: styleService.content.totalValue.background,
      fontWeight: BOLD_FONT_WEIGHT,
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
    ...(!isNumeric && getGridTextClampStyle(styleService.content.lineClamp)),
    alignSelf: "flex-start",
    fontFamily,
    fontSize,
  };
};
