import type React from "react";
import type { HeaderCell, ShowLastBorder } from "../../types/types";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

// TODO Replace with colors from Sprout
export enum Colors {
  Transparent = "transparent",
  FontPrimary = "#404040",
  FontSecondary = "#737373",
  DividerDark = "#595959",
  DividerLight = "#D9D9D9",
  NullValueBackground = "#F2F2F2",
}

export enum BorderStyle {
  Solid = "solid",
  None = "none",
}

export const CELL_PADDING = 4;

export const DOUBLE_CELL_PADDING = CELL_PADDING * 2;

export const baseFlex: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const borderStyle: Pick<React.CSSProperties, "borderStyle"> = {
  borderStyle: "solid",
};

export const baseCellStyle: React.CSSProperties = {
  boxSizing: "border-box",
  padding: `${CELL_PADDING}px ${DOUBLE_CELL_PADDING}px`,
  userSelect: "none",
  WebkitUserSelect: "none",
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

const getBorderAttributes = (width: number, color: string) =>
  width > 0 ? `${width}px ${BorderStyle.Solid} ${color}` : BorderStyle.None;

export const getBorderStyle = (
  isLastRow: boolean,
  isLastColumn: boolean,
  borderColor: string,
  showLastBorder?: ShowLastBorder,
): React.CSSProperties => {
  const borderRightWidth = Number(!isLastColumn || showLastBorder?.right);
  const borderBottomWidth = Number(!isLastRow || showLastBorder?.bottom);

  return {
    borderRight: getBorderAttributes(borderRightWidth, borderColor),
    borderBottom: getBorderAttributes(borderBottomWidth, borderColor),
    borderLeft: BorderStyle.None,
    borderTop: BorderStyle.None,
  };
};

export const getHeaderBorderStyle = (
  cell: HeaderCell,
  isLastRow: boolean,
  isFirstColumn: boolean,
  isLastColumn: boolean,
  borderColor: string,
  showLastBorder?: ShowLastBorder,
) => {
  const headerBorderStyle = getBorderStyle(isLastRow, isLastColumn, borderColor, showLastBorder);

  if (!cell.isLeftDimension) {
    if (cell.isLastDimension && !isLastRow) {
      headerBorderStyle.borderBottom = getBorderAttributes(2, borderColor);
    }

    if (!isFirstColumn) {
      headerBorderStyle.borderLeft = getBorderAttributes(1, borderColor);
    }
  }

  return headerBorderStyle;
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
    style.borderBottom = getBorderAttributes(1, borderColor);
  }

  if (rightDivider) {
    style.borderRight = getBorderAttributes(1, borderColor);
  }

  return style;
};
