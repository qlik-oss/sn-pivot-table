import { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { DataModel, LayoutService, LeftDimensionData, List } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import useOnPropsChange from "../../hooks/use-on-props-change";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
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
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "fit-content",
};

const listStyle: React.CSSProperties = {
  overflow: "hidden",
};

const rightListStyle: React.CSSProperties = {
  borderWidth: "0px 1px 0px 0px",
  ...gridBorderStyle,
  boxSizing: "content-box",
};

const getItemSizeCallback = (list: List, cellHeight: number) => (rowIndex: number) => {
  const cell = Object.values(list)[rowIndex];

  if (cell?.leafCount > 0) {
    return (cell.leafCount + cell.distanceToNextCell) * cellHeight;
  }

  return cellHeight;
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
}: LeftGridProps): JSX.Element | null => {
  const { qDimensionInfo, qSize } = layoutService.layout.qHyperCube;
  const { cellHeight } = useStyleContext();

  useOnPropsChange(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.resetAfterIndex(0, false));
    }
  }, [dataModel, width, height, leftDimensionData, leftGridRef]);

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.scrollTo(getScrollTop()));
    }
  }, [getScrollTop, layoutService, leftGridRef]);

  const getKey = (colIndex: number): string => {
    const dimIndex = leftDimensionData.dimensionInfoIndexMap[colIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return "-1";
    }
    return `${qDimensionInfo[dimIndex].qFallbackTitle}-${dimIndex}`;
  };

  const totalHeight = qSize.qcy * cellHeight;

  if (leftDimensionData.size.x === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {leftDimensionData.grid.map((list, colIndex) => {
        const isLastColumn = colIndex === leftDimensionData.size.x - 1;
        const { itemCount, estimatedItemSize } = getListMeta(list, totalHeight, qSize.qcy, isLastColumn);

        return (
          <VariableSizeList
            key={getKey(colIndex)}
            ref={setListRef(leftGridRef, colIndex)}
            style={isLastColumn ? { ...listStyle, ...rightListStyle } : listStyle}
            height={height}
            width={getLeftColumnWidth(colIndex)}
            itemCount={itemCount}
            itemSize={getItemSizeCallback(list, cellHeight)}
            layout="vertical"
            itemData={{
              layoutService,
              dataModel,
              constraints,
              list,
              isLeftColumn: true,
              isLast: isLastColumn && !layoutService.layout.snapshotData,
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
