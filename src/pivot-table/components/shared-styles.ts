import type React from "react";
import type { HeaderType } from "../../types/types";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

export enum Colors {
  PrimaryText = "#404040",
  Black3 = "rgba(0, 0, 0, 0.03)",
  Black5 = "rgba(0, 0, 0, 0.05)",
  Black15 = "rgba(0, 0, 0, 0.15)",
  Black55 = "rgba(0, 0, 0, 0.55)",
  Black60 = "rgba(0, 0, 0, 0.6)",
  Transparent = "transparent",
}

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

export const getHeaderBorderStyle = (
  isLastRow: boolean,
  isLastColumn: boolean,
  isFirstColumn: boolean,
  borderColor: string,
  headerType: HeaderType
): React.CSSProperties => {
  const borderWidths: React.CSSProperties = {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  };

  switch (headerType) {
    case "top":
      borderWidths.borderBottomWidth = 1;
      borderWidths.borderLeftWidth = isFirstColumn ? 0 : 1;
      break;
    case "top_last":
      borderWidths.borderBottomWidth = isLastRow ? 1 : 2;
      borderWidths.borderLeftWidth = isFirstColumn ? 0 : 1;
      break;
    case "left":
      borderWidths.borderRightWidth = 1;
      break;
    case "left_last":
      borderWidths.borderRightWidth = isLastColumn ? 0 : 1;
      break;
    default:
      break;
  }
  return {
    ...cellStyle,
    ...borderStyle,
    ...borderWidths,
    borderColor,
  };
};

export const getBorderStyle = (
  isLastRow: boolean,
  isLastColumn: boolean,
  borderColor: string,
  showLastRowBorderBottom: boolean
) => {
  if (isLastRow && isLastColumn) {
    if (showLastRowBorderBottom) {
      return { ...borderBottomStyle, borderColor };
    }
    return cellStyle;
  }

  if (isLastRow) {
    if (showLastRowBorderBottom) {
      return { ...borderBottomRightStyle, borderColor };
    }
    return { ...borderRightStyle, borderColor };
  }

  if (isLastColumn) {
    return { ...borderBottomStyle, borderColor };
  }

  return { ...borderBottomRightStyle, borderColor };
};
