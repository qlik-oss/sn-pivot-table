import React, { type ReactNode } from "react";
import type { Cell, StyleService } from "../../../../types/types";
import { DEFAULT_LINE_CLAMP, LINE_HEIGHT_COEFFICIENT } from "../../../constants";
import { CELL_PADDING, getLineClampStyle, textStyle } from "../../shared-styles";
import { getColor, getFontStyle, getFontWeight, getTextDecoration } from "./utils/get-style";

type Props = {
  isLeftColumn: boolean;
  isCellSelected: boolean;
  cell: Cell;
  styleService: StyleService;
  children: ReactNode;
};

const getMarginTop = (styleService: StyleService) => {
  const textHeight = parseInt(styleService.dimensionValues.fontSize, 10) * LINE_HEIGHT_COEFFICIENT;

  return styleService.contentCellHeight / 2 - textHeight / 2 - CELL_PADDING;
};

const Text = ({ children, cell, styleService, isCellSelected, isLeftColumn }: Props): JSX.Element => (
  <span
    style={{
      ...textStyle,
      ...getLineClampStyle(
        isLeftColumn
          ? Math.max(styleService.grid.lineClamp, cell.leafCount * styleService.grid.lineClamp)
          : DEFAULT_LINE_CLAMP,
      ),
      color: getColor({ cell, styleService, isCellSelected }),
      fontWeight: getFontWeight({ cell, styleService }),
      fontStyle: getFontStyle({ cell, styleService }),
      textDecoration: getTextDecoration({ cell, styleService }),
      fontFamily: styleService.dimensionValues.fontFamily,
      fontSize: styleService.dimensionValues.fontSize,
      // marginTop is need on left side to put the align the expand/collapse icon and the text
      marginTop: isLeftColumn ? getMarginTop(styleService) : undefined,
      // 0px at bottom to handle an issue in Firefox where line clamped text, after the ellipsis, is still drawn
      // on the next text line
      padding: isLeftColumn ? `${CELL_PADDING}px ${CELL_PADDING}px 0px ${CELL_PADDING}px` : `0px ${CELL_PADDING}px`,
    }}
  >
    {children}
  </span>
);

export default Text;
