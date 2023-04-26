import { useMemo } from "react";
import { LayoutService, StyleService } from "../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../constants";

interface UseCellHeightProps {
  styleService: StyleService;
  layoutService: LayoutService;
}

interface UseCellHeight {
  (args: UseCellHeightProps): {
    lineClamp: number;
    headerCellHeight: number;
    contentCellHeight: number;
  };
}

const LINE_HEIGHT_COEFFICIENT = 4 / 3;
const fontSizeToRowHeight = (fontSize: string, lineClamp: number) =>
  +(parseInt(fontSize, 10) * LINE_HEIGHT_COEFFICIENT * lineClamp).toFixed(2);

const useCellHeight: UseCellHeight = ({ styleService, layoutService }) => {
  const lineClamp = useMemo<number>(() => {
    const rowHeight = layoutService.layout.components?.find((n) => n.key === "theme")?.rowHeight;
    return rowHeight?.linesCount || 1;
  }, [layoutService.layout.components]);

  return {
    lineClamp,
    headerCellHeight: Math.max(fontSizeToRowHeight(styleService.header.fontSize, lineClamp), DEFAULT_ROW_HEIGHT),
    contentCellHeight: Math.max(fontSizeToRowHeight(styleService.content.fontSize, lineClamp), DEFAULT_ROW_HEIGHT),
  };
};

export default useCellHeight;
