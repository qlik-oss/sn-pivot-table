import type React from "react";
import type { StyleService } from "../../../../types/types";
import { getBorderStyle, getLineClampStyle, stickyCell, textStyle } from "../../shared-styles";

interface GetTextStyle {
  isLeftColumn: boolean;
  styleService: StyleService;
  qCanExpand: boolean;
  qCanCollapse: boolean;
  isCellSelected: boolean;
  isNull: boolean;
}

interface GetContainerStyle {
  isCellLocked: boolean;
  isNull: boolean;
  isNonSelectableCell: boolean;
  style: React.CSSProperties;
  isLastRow: boolean;
  isLastColumn: boolean;
  isCellSelected: boolean;
  styleService: StyleService;
  isLeftColumn: boolean;
}

export const selectedStyle: Pick<React.CSSProperties, "color" | "background"> = {
  background: "#0aaf54",
  color: "white",
};

export const selectableCellStyle: Pick<React.CSSProperties, "cursor"> = {
  cursor: "pointer",
};

// Locked background image does not work great with cells that have colorful backgrounds
export const lockedFromSelectionStyle: Pick<React.CSSProperties, "color" | "backgroundImage"> = {
  backgroundImage: "repeating-linear-gradient(-45deg, #f8f8f8, #f8f8f8 2px, transparent 2px, transparent 4px)",
  color: "#bebebe",
};

const cellStyle: Pick<React.CSSProperties, "display" | "flexDirection" | "alignItems" | "gap"> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "4px",
};

export const getContainerStyle = ({
  isCellLocked,
  isNull,
  style,
  isLastColumn,
  isLastRow,
  isNonSelectableCell,
  isCellSelected,
  styleService,
  isLeftColumn,
}: GetContainerStyle) => {
  const resolvedSelectedStyle = isCellSelected ? selectedStyle : {};
  const resolvedLockedSelectionStyle = isCellLocked ? lockedFromSelectionStyle : {};
  const resolvedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const { nullValue, background } = isLeftColumn ? styleService.rowContent : styleService.columnContent;
  const resolvedNullStyle = isNull ? nullValue : { background };

  return {
    ...style,
    ...resolvedLockedSelectionStyle,
    ...resolvedSelectableCellStyle,
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border),
    ...resolvedNullStyle,
    ...resolvedSelectedStyle,
    display: "flex",
  };
};

export const getInnerContainerStyle = (isLeftColumn: boolean) => ({
  ...cellStyle,
  ...stickyCell,
  alignSelf: isLeftColumn ? "flex-start" : "flex-end",
});

export const getTextStyle = ({
  styleService,
  isLeftColumn,
  qCanCollapse,
  qCanExpand,
  isCellSelected,
  isNull,
}: GetTextStyle): React.CSSProperties => {
  const { nullValue, totalLabel, measureLabel, background, ...serviceStyle } = isLeftColumn
    ? styleService.rowContent
    : styleService.columnContent;

  return {
    ...serviceStyle,
    ...textStyle,
    ...(isNull && { color: nullValue.color }),
    ...(isCellSelected && { color: selectedStyle.color }),
    fontWeight: qCanExpand || qCanCollapse ? "600" : undefined,
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...getLineClampStyle(styleService.lineClamp),
  };
};
