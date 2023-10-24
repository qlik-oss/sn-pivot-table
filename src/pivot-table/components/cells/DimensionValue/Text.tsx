import React, { type ReactNode } from "react";
import type { Cell, StyleService } from "../../../../types/types";
import { DEFAULT_LINE_CLAMP, LINE_HEIGHT_COEFFICIENT } from "../../../constants";
import { getLineClampStyle } from "../../shared-styles";
import { getColor, getFontStyle, getFontWeight, getTextDecoration } from "./utils/get-style";

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
      lineHeight: `calc(${LINE_HEIGHT_COEFFICIENT})`,
      color: getColor({ cell, styleService, isCellSelected }),
      fontWeight: getFontWeight({ cell, styleService }),
      fontStyle: getFontStyle({ cell, styleService }),
      textDecoration: getTextDecoration({ cell, styleService }),
      fontFamily: styleService.dimensionValues.fontFamily,
      fontSize: styleService.dimensionValues.fontSize,
      ...getLineClampStyle(isLeftColumn ? styleService.grid.lineClamp : DEFAULT_LINE_CLAMP),
    }}
  >
    {children}
  </span>
);

export default Text;
