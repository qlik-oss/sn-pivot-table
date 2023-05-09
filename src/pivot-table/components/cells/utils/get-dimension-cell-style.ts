import type React from "react";
import type { StyleService } from "../../../../types/types";
import { NULL_BACKGROUND_COLOR, getBorderStyle, getLineClampStyle, stickyCell, textStyle } from "../../shared-styles";

interface GetTextStyle {
  isLeftColumn: boolean;
  styleService: StyleService;
  qCanExpand: boolean;
  qCanCollapse: boolean;
  isCellSelected: boolean;
}

interface GetContainerStyle {
  isCellLocked: boolean;
  isNull: boolean;
  isNonSelectableCell: boolean;
  style: React.CSSProperties;
  isLastRow: boolean;
  isLastColumn: boolean;
  isCellSelected: boolean;
}

export const selectedStyle: Pick<React.CSSProperties, "color" | "backgroundColor"> = {
  backgroundColor: "#0aaf54",
  color: "white",
};

export const selectableCellStyle: Pick<React.CSSProperties, "cursor"> = {
  cursor: "pointer",
};

export const lockedFromSelectionStyle: Pick<React.CSSProperties, "color" | "backgroundImage"> = {
  backgroundImage: "repeating-linear-gradient(-45deg, #f8f8f8, #f8f8f8 2px, transparent 2px, transparent 4px)",
  color: "#bebebe",
};

const nullStyle: Pick<React.CSSProperties, "backgroundColor"> = {
  backgroundColor: NULL_BACKGROUND_COLOR,
};

const cellStyle: Pick<React.CSSProperties, "display" | "flexDirection" | "alignItems"> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const containerStyle: Pick<React.CSSProperties, "color"> = {
  color: "#595959",
};

export const getContainerStyle = ({
  isCellLocked,
  isNull,
  style,
  isLastColumn,
  isLastRow,
  isNonSelectableCell,
  isCellSelected,
}: GetContainerStyle) => {
  const resolvedSelectedStyle = isCellSelected ? selectedStyle : {};
  const resolvedLockedSelectionStyle = isCellLocked ? lockedFromSelectionStyle : {};
  const resolvedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const resolvedNullStyle = isNull ? nullStyle : {};

  return {
    ...style,
    ...containerStyle,
    ...resolvedSelectedStyle,
    ...resolvedLockedSelectionStyle,
    ...resolvedSelectableCellStyle,
    ...getBorderStyle(isLastRow, isLastColumn),
    ...resolvedNullStyle,
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
}: GetTextStyle): React.CSSProperties => {
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;

  return {
    ...serviceStyle,
    ...textStyle,
    ...(isCellSelected ? { color: selectedStyle.color } : {}),
    fontWeight: qCanExpand || qCanCollapse ? "600" : undefined,
    marginLeft: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...getLineClampStyle(styleService.lineClamp),
  };
};
