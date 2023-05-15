import type React from "react";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

export const DATA_TEXT_COLOR = "rgba(0, 0, 0, 0.55)";
export const NULL_TEXT_COLOR = "#404040";
export const NULL_BACKGROUND_COLOR = "rgba(0, 0, 0, 0.05)";
export const DARK_BORDER_COLOR = "rgba(0, 0, 0, 0.60)";
export const LIGHT_BORDER_COLOR = "rgba(0, 0, 0, 0.15)";

export const borderStyle: Pick<React.CSSProperties, "borderStyle"> = {
  borderStyle: "solid",
};

export const cellStyle: Pick<React.CSSProperties, "boxSizing" | "padding"> = {
  boxSizing: "border-box",
  padding: 4,
};

export const borderBottomRightStyle: React.CSSProperties = {
  ...cellStyle,
  ...borderStyle,
  borderLeftWidth: 0,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderTopWidth: 0,
};

export const borderBottomStyle: React.CSSProperties = {
  ...cellStyle,
  ...borderStyle,
  borderLeftWidth: 0,
  borderBottomWidth: 1,
  borderRightWidth: 0,
  borderTopWidth: 0,
};

export const borderRightStyle: React.CSSProperties = {
  ...cellStyle,
  ...borderStyle,
  borderLeftWidth: 0,
  borderBottomWidth: 0,
  borderRightWidth: 1,
  borderTopWidth: 0,
};

export const textStyle: React.CSSProperties = {
  lineHeight: `calc(${LINE_HEIGHT_COEFFICIENT})`,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

export const gridBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderColor: DARK_BORDER_COLOR,
};

export const getLineClampStyle = (clampCount: number): React.CSSProperties => ({
  whiteSpace: "unset",
  display: "-webkit-box",
  WebkitLineClamp: clampCount,
  WebkitBoxOrient: "vertical",
  lineBreak: "anywhere",
});

export const stickyCell: Pick<React.CSSProperties, "width" | "maxWidth" | "position" | "left" | "top"> = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: 4,
  top: 4,
};

export const getBorderStyle = (isLastRow: boolean, isLastColumn: boolean, borderColor: string) => {
  if (isLastRow && isLastColumn) {
    return cellStyle;
  }

  if (isLastRow) {
    return { ...borderRightStyle, borderColor };
  }

  if (isLastColumn) {
    return { ...borderBottomStyle, borderColor };
  }

  return { ...borderBottomRightStyle, borderColor };
};
