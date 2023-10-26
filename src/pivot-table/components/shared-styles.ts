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

export const baseFlex: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-all",
});

export const getBorderStyle = (
  isLastRow: boolean,
  isLastColumn: boolean,
  borderColor: string,
  showLastBorder?: ShowLastBorder,
) => {
  const showRightBorder = !isLastColumn || showLastBorder?.right;
  const showBottomBorder = !isLastRow || showLastBorder?.bottom;
  const borderRightWidth = showRightBorder ? 1 : 0;
  const borderRightColor = showRightBorder ? borderColor : undefined;
  const borderBottomWidth = showBottomBorder ? 1 : 0;
  const borderBottomColor = showBottomBorder ? borderColor : undefined;

  return {
    ...cellStyle,
    ...borderStyle,
    borderRightColor,
    borderBottomColor,
    borderWidth: 0,
    borderRightWidth,
    borderBottomWidth,
  };
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
