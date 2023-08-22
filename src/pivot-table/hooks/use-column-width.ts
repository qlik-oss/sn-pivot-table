import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { Header, HeadersData, LayoutService, Rect } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText from "./use-measure-text";

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  totalMeasureInfoColumnWidth: number;
  getLeftColumnWidth: (index: number) => number;
  getDataColumnWidth: (index: number) => number;
  getMeasureInfoWidth: (index: number) => number;
  getTotalWidth: () => number;
}

export const EXPAND_ICON_WIDTH = 30;
const MIN_COLUMN_WIDTH = 100;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  headersData: HeadersData
): ColumnWidthHook {
  const {
    size,
    layout: {
      qHyperCube: { qMeasureInfo },
    },
  } = layoutService;
  const styleService = useStyleContext();
  const { estimateWidth: estimateWidthForContent, measureText: measureTextForContent } = useMeasureText(
    styleService.content.fontSize,
    styleService.content.fontFamily
  );
  const { measureText: measureTextForHeader } = useMeasureText(
    styleService.header.fontSize,
    styleService.header.fontFamily
  );

  const hasPseudoDimOnLeft = useMemo(
    () => headersData.data.at(-1)?.find((h) => h?.type.startsWith("left") && h.id === PSEUDO_DIMENSION_INDEX),
    [headersData.data]
  );
  // const hasPseudoDimOnTop = useMemo(() => visibleTopDimensionInfo.includes(-1), [visibleTopDimensionInfo]);

  const leftColumnWidthsRatios = useMemo(() => {
    const measureHeader = (header: Header | null): number => {
      if (header === null) return 0;
      if (header.id === PSEUDO_DIMENSION_INDEX && header.type.startsWith("left")) {
        const pseudoDimensionWidth = Math.max(...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));

        return pseudoDimensionWidth;
      }

      const { title, approximateMaxGlyphCount } = header;
      const hasChildNodes = header.type === "left";
      const collapseExpandIconSize = hasChildNodes ? EXPAND_ICON_WIDTH : 0;
      let w = Math.max(
        measureTextForHeader(title),
        estimateWidthForContent(approximateMaxGlyphCount) + collapseExpandIconSize
      );

      if (header.type === "top_last" && header.includeMeasures) {
        w = Math.max(w, ...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));
      }

      return w;
    };

    const ratios: number[] = [];
    for (let column = 0; column < headersData.size.cols; column++) {
      let columnWidth = 0;
      for (let row = 0; row < headersData.size.rows; row++) {
        columnWidth = Math.max(columnWidth, measureHeader(headersData.data[row][column]));
      }
      ratios.push(columnWidth / rect.width);
    }

    // If the bottom last cell is of type top_last and that column doesn't contain measures that column can
    // be squeezed into the previous one
    const lastCell = headersData.data.at(-1)?.at(-1);
    const lastLeftCell = headersData.data.at(-1)?.at(-2);
    if (lastLeftCell && lastCell && lastCell.type === "top_last" && !lastCell.includeMeasures) {
      const lastLeftHeaderWidth = measureTextForHeader(lastLeftCell.title) / rect.width;
      const topHeadersWidth =
        headersData.data.reduce(
          (max, row) => Math.max(max, measureTextForHeader(row[row.length - 1] ? row[row.length - 1]!.title : "")),
          0
        ) / rect.width;
      ratios[ratios.length - 2] -= Math.max(lastLeftHeaderWidth - topHeadersWidth, 0);
    }

    const sumOfRatios = ratios.reduce((sum, r) => sum + r, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return ratios;

    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return ratios.map((r) => r * multiplier);
  }, [
    measureTextForHeader,
    estimateWidthForContent,
    rect.width,
    qMeasureInfo,
    measureTextForContent,
    headersData.size.cols,
    headersData.size.rows,
    headersData.data,
  ]);

  const getLeftColumnWidth = useCallback(
    (index: number) => leftColumnWidthsRatios[index] * rect.width, // + CELL_PADDING_WIDTH,
    [leftColumnWidthsRatios, rect.width]
  );
  const leftGridWidth = useMemo(
    () => leftColumnWidthsRatios.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [leftColumnWidthsRatios, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(() => Math.max(rect.width - leftGridWidth - GRID_BORDER), [leftGridWidth, rect.width]);
  const preCalcTotalDataColumnWidth = useMemo(() => {
    if (hasPseudoDimOnLeft) {
      return qMeasureInfo.reduce(
        (currentMaxWidth, { qApprMaxGlyphCount }) =>
          Math.max(currentMaxWidth, MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount)),
        0
      );
    }

    return qMeasureInfo.reduce(
      (width, { qApprMaxGlyphCount, qFallbackTitle }) =>
        width +
        Math.max(MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount), measureTextForContent(qFallbackTitle)),
      0
    );
  }, [qMeasureInfo, estimateWidthForContent, measureTextForContent, hasPseudoDimOnLeft]);

  const memoizedGetMeasureInfoWidth = useMemo(
    () =>
      memoize((measureInfoIndex: number) => {
        const getWidth = (index: number, includeTitleWidth = true) => {
          const { qApprMaxGlyphCount, qFallbackTitle } = qMeasureInfo[index];
          const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

          return Math.max(
            MIN_COLUMN_WIDTH,
            availableWidth / size.x,
            estimateWidthForContent(qApprMaxGlyphCount),
            includeTitleWidth ? measureTextForContent(qFallbackTitle) : 0
          );
        };

        if (hasPseudoDimOnLeft) {
          return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
        }

        return getWidth(measureInfoIndex);
      }),
    [
      rightGridWidth,
      size.x,
      preCalcTotalDataColumnWidth,
      estimateWidthForContent,
      measureTextForContent,
      qMeasureInfo,
      hasPseudoDimOnLeft,
    ]
  );

  const getDataColumnWidth = useCallback(
    (colIndex: number) => {
      const measureInfoIndex = colIndex % qMeasureInfo.length;
      return memoizedGetMeasureInfoWidth(measureInfoIndex);
    },
    [memoizedGetMeasureInfoWidth, qMeasureInfo]
  );

  const getTotalWidth = useCallback(
    () =>
      Array.from({ length: size.x }, () => null).reduce(
        (width, _, index) => width + getDataColumnWidth(index),
        leftGridWidth
      ),
    [getDataColumnWidth, leftGridWidth, size.x]
  );

  const totalMeasureInfoColumnWidth = useMemo(
    () => qMeasureInfo.reduce((width, _, index) => width + getDataColumnWidth(index), 0),
    [qMeasureInfo, getDataColumnWidth]
  );

  return {
    leftGridWidth,
    rightGridWidth,
    totalMeasureInfoColumnWidth,
    getLeftColumnWidth,
    getDataColumnWidth,
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    getTotalWidth,
  };
}
