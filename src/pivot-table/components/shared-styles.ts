import React from "react";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

const borderStyle: React.CSSProperties = {
  borderColor: "rgba(0, 0, 0, 0.15)",
  borderStyle: "solid",
};

export const cellStyle: React.CSSProperties = {
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
  borderColor: "rgba(0, 0, 0, 0.60)",
};

export const getLineClampStyle = (clampCount: number): React.CSSProperties => ({
  whiteSpace: "unset",
  display: "-webkit-box",
  WebkitLineClamp: clampCount,
  WebkitBoxOrient: "vertical",
  lineBreak: "anywhere",
});

export const stickyCell: React.CSSProperties = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: 4,
  top: 4,
};

export const getBorderStyle = (isLastRow: boolean, isLastColumn: boolean) => {
  if (isLastRow && isLastColumn) {
    return cellStyle;
  }

  if (isLastRow) {
    return borderRightStyle;
  }

  if (isLastColumn) {
    return borderBottomStyle;
  }

  return borderBottomRightStyle;
};
