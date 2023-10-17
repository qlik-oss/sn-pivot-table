import type React from "react";
import type { ShowLastBorder } from "../../types/types";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

// TODO Replace with colors from Sprout
export enum Colors {
  Black3 = "rgba(0, 0, 0, 0.03)",
  Black5 = "rgba(0, 0, 0, 0.05)",
  Black15 = "rgba(0, 0, 0, 0.15)",
  Black55 = "rgba(0, 0, 0, 0.55)",
  Black60 = "rgba(0, 0, 0, 0.6)",
  Transparent = "transparent",
}

export const CELL_PADDING = 4;

export const topContainerCellStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

export const leftContainerCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
};

export const borderStyle: Pick<React.CSSProperties, "borderStyle"> = {
  borderStyle: "solid",
};

export const cellStyle: Pick<React.CSSProperties, "boxSizing" | "padding" | "userSelect"> = {
  boxSizing: "border-box",
  padding: CELL_PADDING,
  userSelect: "none",
};

export const textStyle: React.CSSProperties = {
  lineHeight: `calc(${LINE_HEIGHT_COEFFICIENT})`,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

export const getLineClampStyle = (clampCount: number): React.CSSProperties => ({
  whiteSpace: "unset",
  display: "-webkit-box",
  WebkitLineClamp: clampCount,
  WebkitBoxOrient: "vertical",
  lineBreak: "auto",
});

export const stickyCell: Pick<React.CSSProperties, "width" | "maxWidth" | "position" | "left" | "top"> = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: CELL_PADDING,
  top: CELL_PADDING,
};

export const getBorderStyle = (
  isLastRow: boolean,
  isLastColumn: boolean,
  borderColor: string,
  showLastBorder?: ShowLastBorder,
) => {
  const borderRightWidth = !isLastColumn || showLastBorder?.right ? 1 : 0;
  const borderBottomWidth = !isLastRow || showLastBorder?.bottom ? 1 : 0;

  return { ...cellStyle, ...borderStyle, borderColor, borderWidth: 0, borderRightWidth, borderBottomWidth };
};

export const getTotalCellDividerStyle = ({
  bottomDivider,
  rightDivider,
  borderColor,
}: {
  bottomDivider: boolean;
  rightDivider: boolean;
  borderColor: string;
}) => {
  const style: React.CSSProperties = {};

  if (bottomDivider) {
    style.borderBottomColor = borderColor;
  }

  if (rightDivider) {
    style.borderRightColor = borderColor;
  }

  return style;
};

export const getLeftGridStyles = (leftGridWidth: number): React.CSSProperties => ({
  width: leftGridWidth,
  overflow: "scroll",
  position: "relative",
  display: "flex",
  flexDirection: "column",
});
