import { getHoverColor as getContrastingColor } from "@qlik/nebula-table-utils/lib/utils";
import type { Cell, StyleService } from "../../../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../../../constants";

type GetStyleServiceValueProps = {
  cell: Cell;
  styleService: StyleService;
};

type GetBackgroundColorProps = GetStyleServiceValueProps & {
  isCellSelected: boolean;
  isCellLocked: boolean;
};

type GetColorProps = GetStyleServiceValueProps & { isCellSelected: boolean };

enum Properties {
  Background = "background",
  Color = "color",
  FontWeight = "fontWeight",
  FontStyle = "fontStyle",
  TextDecoration = "textDecoration",
}

const lockedColorModifiers = { brighter: 0.5, darker: 0.3, opacity: 0.03 };

const getLockedBackground = (originalBackgroundColor: string) => {
  const strip = getContrastingColor(originalBackgroundColor, lockedColorModifiers);

  return `repeating-linear-gradient(
    -45deg,
    ${strip} 0px 2px,
    ${originalBackgroundColor} 0px 4px
  ) border-box`;
};

const getStyleServiceValue = (prop: Properties, { cell, styleService }: GetStyleServiceValueProps) => {
  if (prop === Properties.Background || prop === Properties.Color) {
    const expressionValue = cell.expressionColor[prop];
    if (expressionValue) {
      return expressionValue;
    }
  }

  if (cell.isNull) {
    return styleService.nullValues[prop];
  }

  if (cell.isPseudoDimension) {
    return styleService.measureLabels[prop];
  }

  if (cell.isTotal) {
    return styleService.totalValues[prop];
  }

  return styleService.dimensionValues[prop];
};

export const getBackground = ({ styleService, isCellSelected, cell, isCellLocked }: GetBackgroundColorProps) => {
  if (isCellSelected) {
    return "#0aaf54";
  }

  const backgroundColor = getStyleServiceValue(Properties.Background, { cell, styleService });

  if (isCellLocked && backgroundColor && !cell.isPseudoDimension && !cell.isEmpty && !cell.isNull && !cell.isTotal) {
    return getLockedBackground(backgroundColor);
  }

  return getStyleServiceValue(Properties.Background, { cell, styleService });
};

export const getColor = ({ cell, styleService, isCellSelected }: GetColorProps) => {
  if (isCellSelected) {
    return "white";
  }

  return getStyleServiceValue(Properties.Color, { cell, styleService }) as string;
};

export const getFontWeight = ({ cell, styleService }: GetStyleServiceValueProps) => {
  const { qCanCollapse, qCanExpand } = cell.ref;

  // fontWeight coming from Styling panel is undefined when the user have not
  // explicity set it to bold or normal
  const fontWeight = getStyleServiceValue(Properties.FontWeight, { cell, styleService });
  return fontWeight === undefined && (qCanExpand || qCanCollapse) ? BOLD_FONT_WEIGHT : fontWeight;
};

export const getFontStyle = ({ cell, styleService }: GetStyleServiceValueProps) =>
  getStyleServiceValue(Properties.FontStyle, { cell, styleService });

export const getTextDecoration = ({ cell, styleService }: GetStyleServiceValueProps) =>
  getStyleServiceValue(Properties.TextDecoration, { cell, styleService });

export const getCursor = (canBeSelected: boolean) => (canBeSelected ? "pointer" : "default");
