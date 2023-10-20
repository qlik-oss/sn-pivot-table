import React, { type ReactNode } from "react";
import type { Cell, StyleService } from "../../../../types/types";
import { DEFAULT_LINE_CLAMP } from "../../../constants";
import { getLineClampStyle } from "../../shared-styles";
import { getColor, getFontStyle, getFontWeight, getTextDecoration } from "../utils/get-dimension-value-cell-style";

type Props = {
  isLeftColumn: boolean;
  isCellSelected: boolean;
  cell: Cell;
  styleService: StyleService;
  children: ReactNode;
};

const Text = ({ children, cell, styleService, isCellSelected, isLeftColumn }: Props): JSX.Element => (
  <span
    style={{
      color: getColor({ cell, styleService, isCellSelected }),
      fontWeight: getFontWeight({ cell, styleService }),
      fontStyle: getFontStyle({ cell, styleService }),
      textDecoration: getTextDecoration({ cell, styleService }),
      ...getLineClampStyle(isLeftColumn ? styleService.grid.lineClamp : DEFAULT_LINE_CLAMP),
    }}
  >
    {children}
  </span>
);

export default Text;
