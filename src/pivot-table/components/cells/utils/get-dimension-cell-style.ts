import { getHoverColor as getContrastingColor } from "@qlik/nebula-table-utils/lib/utils";
import type React from "react";
import type { ShowLastBorder, StyleService } from "../../../../types/types";
import { DEFAULT_LINE_CLAMP } from "../../../constants";
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
  expressionColor: string | null;
  isTotal: boolean;
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
  showLastBorder: ShowLastBorder;
  showTotalCellDivider: boolean;
  expressionBackground: string | null;
}

export const selectedStyle: React.CSSProperties = {
  background: "#0aaf54",
  color: "white",
};

export const selectableCellStyle: React.CSSProperties = {
  cursor: "pointer",
};

const lockedColorModifiers = { brighter: 0.5, darker: 0.3, opacity: 0.03 };

// Locked background does override any background color set by the user via theming or styling panel
export const getLockedStyleFromSelection = (originalBackgroundColor?: string): React.CSSProperties => {
  const strip = originalBackgroundColor
    ? getContrastingColor(originalBackgroundColor, lockedColorModifiers)
    : "#c8c8c814";

  return {
    background: `repeating-linear-gradient(
        -45deg,
        ${strip} 0px 2px,
        ${originalBackgroundColor ?? Colors.Transparent} 0px 4px
      )`,
    color: "#bebebe",
  };
};

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
  showLastBorder,
  showTotalCellDivider,
  expressionBackground,
}: GetContainerStyle) => {
  const resolvedSelectedStyle = isCellSelected ? selectedStyle : {};
  const { background: styleServiceBackground } = isLeftColumn ? styleService.rowContent : styleService.columnContent;
  const background = expressionBackground ?? styleServiceBackground;
  const resolvedLockedSelectionStyle = isCellLocked ? getLockedStyleFromSelection(background) : {};
  const resolvedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const resolvedNullStyle = isNull ? styleService.nullValue : { background };

  return {
    ...style,
    ...resolvedSelectableCellStyle,
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
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
  expressionColor,
  isTotal,
}: GetTextStyle): React.CSSProperties => {
  const { measureLabel, background, fontWeight, ...serviceStyle } = isLeftColumn
    ? styleService.rowContent
    : styleService.columnContent;
  const nullValueStyling = isNull && {
    color: styleService.nullValue.color,
    fontWeight: styleService.nullValue.fontWeight,
    fontStyle: styleService.nullValue.fontStyle,
    textDecoration: styleService.nullValue.textDecoration,
  };

  const totalValueStyling = isTotal && {
    color: styleService.totalValue.color,
    fontWeight: styleService.totalValue.fontWeight,
    fontStyle: styleService.totalValue.fontStyle,
    textDecoration: styleService.totalValue.textDecoration,
  };

  return {
    ...serviceStyle,
    ...textStyle,
    ...(expressionColor && { color: expressionColor }),
    // fontWeight coming from Styling panel is undefined when the user have not
    // explicity set it to bold or normal
    fontWeight: fontWeight === undefined && (qCanExpand || qCanCollapse) ? "600" : fontWeight,
    ...totalValueStyling,
    ...nullValueStyling,
    ...(isCellSelected && { color: selectedStyle.color }),
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...getLineClampStyle(isLeftColumn ? styleService.content.lineClamp : DEFAULT_LINE_CLAMP),
  };
};
