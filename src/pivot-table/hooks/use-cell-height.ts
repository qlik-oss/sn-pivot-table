import { useMemo } from "react";
import { LayoutService, StyleService } from "../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../constants";

interface UseCellHeightProps {
  styleService: StyleService;
  layoutService: LayoutService;
}

interface UseCellHeight {
  (args: UseCellHeightProps): {
    headerCellHeight: number;
    contentCellHeight: number;
  };
}

const LINE_HEIGHT = 4 / 3;
const CELL_PADDING_HEIGHT = 8;
const CELL_BORDER_HEIGHT = 1;

const useCellHeight: UseCellHeight = ({ styleService, layoutService }) => {
  const rowHeight = useMemo(
    () => layoutService.layout.components?.find((n) => n.key === "theme")?.rowHeight,
    [layoutService.layout.components]
  );

  const lineClamp = rowHeight?.linesCount || 1;

  console.log({ styleService });

  const fontSizeToRowHeight = (fontSize: string) => parseInt(fontSize, 10) * LINE_HEIGHT; // + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;

  const calculatedHeaderCellHeight: number = useMemo(
    () => fontSizeToRowHeight(styleService.header.fontSize) * lineClamp,
    [lineClamp, styleService.header.fontSize]
  );

  const calculatedContentCellHeight: number = useMemo(
    () => fontSizeToRowHeight(styleService.content.fontSize) * lineClamp,
    [lineClamp, styleService.content.fontSize]
  );

  return {
    headerCellHeight: Math.max(+calculatedHeaderCellHeight.toFixed(2), DEFAULT_ROW_HEIGHT),
    contentCellHeight: Math.max(+calculatedContentCellHeight.toFixed(2), DEFAULT_ROW_HEIGHT),
  };
};

export default useCellHeight;
