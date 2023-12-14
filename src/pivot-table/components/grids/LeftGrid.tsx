import React, { memo } from "react";
import { VariableSizeList } from "react-window";
import type {
  DataModel,
  LayoutService,
  LeftDimensionData,
  PageInfo,
  ShowLastBorder,
  VisibleDimensionInfo,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { useResetListCache, useResetListCacheAndRerender } from "../../hooks/use-reset-list-cache";
import MemoizedDimensionValue from "../cells/DimensionValue";
import { getListIemKey } from "../helpers/get-item-key";
import { getRowHeightHandler } from "../helpers/get-item-size-handler";
import getKey from "../helpers/get-key";
import getListMeta from "../helpers/get-list-meta";
import setListRef from "../helpers/set-list-ref";
import { borderStyle } from "../shared-styles";

interface LeftGridProps {
  dataModel: DataModel;
  leftGridRef: React.RefObject<VariableSizeList[]>;
  width: number;
  columnWidths: number[];
  height: number;
  layoutService: LayoutService;
  leftDimensionData: LeftDimensionData;
  showLastBorder: ShowLastBorder;
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
  pageInfo: PageInfo;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "fit-content",
  borderWidth: "1px 0px 0px 0px",
  ...borderStyle,
};

const listStyle: React.CSSProperties = {
  overflow: "hidden",
  /**
   * "will-change" is by default "transform" in react-window. This disables that default value,
   * as there was issues with rendering border when the width of the react-window "list" was
   * a floating point number.
   *
   * If performance issues arise when scrolling, this may need to be change back the "transform"
   * again to resolve those performance issues, but the issue with rendering border will need to
   * be fixed in some other way.
   */
  willChange: "auto",
  flexShrink: 0,
};

const LeftGrid = ({
  dataModel,
  leftGridRef,
  width,
  columnWidths,
  height,
  layoutService,
  leftDimensionData,
  showLastBorder,
  visibleLeftDimensionInfo,
  pageInfo,
}: LeftGridProps): JSX.Element | null => {
  const { qSize } = layoutService.layout.qHyperCube;
  const {
    contentCellHeight,
    grid: { divider },
  } = useStyleContext();

  useResetListCache(leftGridRef, leftDimensionData);

  useResetListCacheAndRerender(leftGridRef, width, height, contentCellHeight, layoutService);

  const totalHeight = pageInfo.rowsOnCurrentPage * contentCellHeight;

  return (
    <div style={{ ...containerStyle, borderColor: divider }}>
      {leftDimensionData.grid.map((list, colIndex) => {
        const isLastColumn = colIndex === leftDimensionData.columnCount - 1;
        const key = getKey(visibleLeftDimensionInfo[colIndex]);
        const { itemCount, estimatedItemSize, listValues } = getListMeta(
          list,
          totalHeight,
          pageInfo.rowsOnCurrentPage,
          isLastColumn,
        );

        return (
          <VariableSizeList
            key={key}
            ref={setListRef(leftGridRef, colIndex)}
            style={{ ...listStyle, flexGrow: isLastColumn ? 1 : 0 }}
            height={height}
            width={columnWidths[colIndex]}
            itemCount={itemCount}
            itemSize={getRowHeightHandler(list, contentCellHeight, isLastColumn, qSize.qcy)}
            layout="vertical"
            itemData={{
              layoutService,
              dataModel,
              list,
              isLeftColumn: true,
              isLast: isLastColumn && !layoutService.layout.snapshotData,
              itemCount,
              showLastBorder,
              listValues,
              totalDividerIndex: leftDimensionData.totalDividerIndex,
            }}
            itemKey={getListIemKey}
            estimatedItemSize={estimatedItemSize}
          >
            {MemoizedDimensionValue}
          </VariableSizeList>
        );
      })}
    </div>
  );
};

export default memo(LeftGrid);
