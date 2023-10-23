import type { Cell, StyleService } from "../../../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../../../constants";
import { getLockedStyleFromSelection } from "../../utils/get-dimension-cell-style";

type GetStyleServiceValueProps = {
  cell?: Cell;
  styleService: StyleService;
};

enum Properties {
  Background = "background",
  Color = "color",
  FontWeight = "fontWeight",
  FontStyle = "fontStyle",
  TextDecoration = "textDecoration",
}

const getStyleServiceValue = (prop: Properties, { cell, styleService }: GetStyleServiceValueProps) => {
  if (cell?.isNull) {
    return styleService.nullValues[prop];
  }

  if (cell?.isTotal) {
    return styleService.totalValues[prop];
  }

  if (cell?.isPseudoDimension) {
    return styleService.measureLabels[prop];
  }

  if (prop === Properties.Background || prop === Properties.Color) {
    return cell?.expressionColor[prop] ?? styleService.dimensionValues[prop];
  }

  return styleService.dimensionValues[prop];
};

type GetBackgroundProps = GetStyleServiceValueProps & {
  isCellSelected: boolean;
  isCellLocked: boolean;
};

// TODO Empty cell same stylign as undefined cell?
export const getBackground = ({ styleService, isCellLocked, isCellSelected, cell }: GetBackgroundProps) => {
  const background = getStyleServiceValue(Properties.Background, { cell, styleService });

  if (isCellSelected) {
    return "#0aaf54";
  }

  if (isCellLocked) {
    return getLockedStyleFromSelection(background).background as string;
  }

  return background;
};

type GetColorProps = GetStyleServiceValueProps & { isCellSelected: boolean };

export const getColor = ({ cell, styleService, isCellSelected }: GetColorProps) => {
  const color = getStyleServiceValue(Properties.Color, { cell, styleService }) as string;

  if (isCellSelected) {
    return "white";
  }

  return color;
};

export const getFontWeight = ({ cell, styleService }: GetStyleServiceValueProps) => {
  const { qCanCollapse, qCanExpand } = cell?.ref ?? { qCanCollapse: false, qCanExpand: false };

  // fontWeight coming from Styling panel is undefined when the user have not
  // explicity set it to bold or normal
  const fontWeight = getStyleServiceValue(Properties.FontWeight, { cell, styleService });
  return fontWeight === undefined && (qCanExpand || qCanCollapse) ? BOLD_FONT_WEIGHT : fontWeight;
};

export const getFontStyle = ({ cell, styleService }: GetStyleServiceValueProps) =>
  getStyleServiceValue(Properties.FontStyle, { cell, styleService });

type GetTextDecorationProps = {
  cell: Cell;
  styleService: StyleService;
};

export const getTextDecoration = ({ cell, styleService }: GetTextDecorationProps) =>
  getStyleServiceValue(Properties.TextDecoration, { cell, styleService });

export const getCursor = (isNonSelectableCell: boolean) => (isNonSelectableCell ? "default" : "pointer");
