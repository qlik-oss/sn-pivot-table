import type { stardust } from "@nebula.js/stardust";
import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import React, { memo, useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import type { DataModel, LayoutService, LeftDimensionData, VisibleDimensionInfo } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
import { getRowHeightHandler } from "../helpers/get-item-size-handler";
import getKey from "../helpers/get-key";
import getListMeta from "../helpers/get-list-meta";
import setListRef from "../helpers/set-list-ref";
import { gridBorderStyle } from "../shared-styles";

interface LeftGridProps {
  dataModel: DataModel;
  leftGridRef: React.RefObject<VariableSizeList[]>;
  getLeftColumnWidth: (index: number) => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  getScrollTop: () => number;
  layoutService: LayoutService;
  leftDimensionData: LeftDimensionData;
  showLastRowBorderBottom: boolean;
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "fit-content",
  borderWidth: "1px 0px 0px 0px",
  ...gridBorderStyle,
};

const listStyle: React.CSSProperties = {
  overflow: "hidden",
  /**
   * "will-change" is by default "transform" in react-window. This disables that default value,
   * as there was issues with rendering border when the width of the react-window "list" was
   * a floating point number.
   *
   * If performance issues arrise when scrolling, this may need to be change back the "transform"
   * again to resolve those performance issues, but the issue with rendering border will need to
   * be fixed in some other way.
   */
  willChange: "auto",
};

const LeftGrid = ({
  dataModel,
  leftGridRef,
  getLeftColumnWidth,
  width,
  height,
  constraints,
  getScrollTop,
  layoutService,
  leftDimensionData,
  showLastRowBorderBottom,
  visibleLeftDimensionInfo,
}: LeftGridProps): JSX.Element | null => {
  const { qSize } = layoutService.layout.qHyperCube;
  const {
    contentCellHeight,
    grid: { divider },
  } = useStyleContext();

  useOnPropsChange(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.resetAfterIndex(0, false));
    }
  }, [dataModel, width, height, leftDimensionData, leftGridRef, contentCellHeight]);

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.scrollTo(getScrollTop()));
    }
  }, [getScrollTop, layoutService, leftGridRef]);

  const totalHeight = layoutService.size.y * contentCellHeight;

  if (leftDimensionData.columnCount === 0) {
    return null;
  }

  return (
    <div style={{ ...containerStyle, borderColor: divider }}>
      {leftDimensionData.grid.map((list, colIndex) => {
        const isLastColumn = colIndex === leftDimensionData.columnCount - 1;
        const key = getKey(visibleLeftDimensionInfo[colIndex]);
        const { itemCount, estimatedItemSize, listValues } = getListMeta(
          list,
          totalHeight,
          layoutService.size.y,
          isLastColumn,
        );

        return (
          <VariableSizeList
            key={key}
            ref={setListRef(leftGridRef, colIndex)}
            style={listStyle}
            height={height}
            width={getLeftColumnWidth(colIndex)}
            itemCount={itemCount}
            itemSize={getRowHeightHandler(list, contentCellHeight, isLastColumn, qSize.qcy)}
            layout="vertical"
            itemData={{
              layoutService,
              dataModel,
              constraints,
              list,
              isLeftColumn: true,
              isLast: isLastColumn && !layoutService.layout.snapshotData,
              itemCount,
              showLastRowBorderBottom,
              listValues,
              totalDividerIndex: leftDimensionData.totalDividerIndex,
            }}
            itemKey={getItemKey}
            estimatedItemSize={estimatedItemSize}
          >
            {MemoizedListCellFactory}
          </VariableSizeList>
        );
      })}
    </div>
  );
};

export default memo(LeftGrid);
