import type React from "react";
import type { StyleService } from "../../../../types/types";
import {
  Colors,
  getBorderStyle,
  getLineClampStyle,
  getTotalCellDividerStyle,
  stickyCell,
  textStyle,
} from "../../shared-styles";

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
  showLastRowBorderBottom: boolean;
  showTotalCellDivider: boolean;
}

export const selectedStyle: React.CSSProperties = {
  background: "#0aaf54",
  color: "white",
};

export const selectableCellStyle: React.CSSProperties = {
  cursor: "pointer",
};

// Locked background does override any background color set by the user via theming or styling panel
export const getLockedStyleFromSelection = (originalBackgroundColor?: string): React.CSSProperties => ({
  background: `repeating-linear-gradient(
      -45deg, 
      #c8c8c814, 
      #c8c8c814 2px, 
      transparent 2px, 
      transparent 4px
    ), ${originalBackgroundColor ?? Colors.Transparent}`,
  color: "#bebebe",
});

const cellStyle: React.CSSProperties = {
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
  showLastRowBorderBottom,
  showTotalCellDivider,
}: GetContainerStyle) => {
  const resolvedSelectedStyle = isCellSelected ? selectedStyle : {};
  const { nullValue, background } = isLeftColumn ? styleService.rowContent : styleService.columnContent;
  const resolvedLockedSelectionStyle = isCellLocked ? getLockedStyleFromSelection(background) : {};
  const resolvedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const resolvedNullStyle = isNull ? nullValue : { background };

  return {
    ...style,
    ...resolvedSelectableCellStyle,
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastRowBorderBottom),
    ...getTotalCellDividerStyle({
      bottomDivider: showTotalCellDivider && isLeftColumn,
      rightDivider: showTotalCellDivider && !isLeftColumn,
      borderColor: styleService.grid.divider,
    }),
    ...resolvedNullStyle,
    ...resolvedSelectedStyle,
    ...resolvedLockedSelectionStyle,
    display: "flex",
  };
};

export const getInnerContainerStyle = (isLeftColumn: boolean) => ({
  ...cellStyle,
  ...stickyCell,
  alignSelf: isLeftColumn ? "flex-start" : "center",
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
    ...getLineClampStyle(isLeftColumn ? styleService.lineClamp : styleService.headerLineClamp),
  };
};
