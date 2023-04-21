import { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { DataModel, LayoutService, LeftDimensionData, List } from "../../../types/types";
import useOnPropsChange from "../../hooks/use-on-props-change";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
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

const DEFAULT_ROW_HEIGHT = 28;

const getItemSizeCallback = (list: List) => (rowIndex: number) => {
  const cell = Object.values(list)[rowIndex];

  if (cell?.leafCount) {
    return (cell.leafCount + cell.distanceToNextCell) * DEFAULT_ROW_HEIGHT;
  }

  return DEFAULT_ROW_HEIGHT;
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
  const { qDimensionInfo, qMeasureInfo, qSize } = layoutService.layout.qHyperCube;

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

  const lastDimensionIndex = leftDimensionData.dimensionInfoIndexMap.findLastIndex(
    (idx) => idx !== PSEUDO_DIMENSION_INDEX
  );

  const pseudoDimensionIndex = leftDimensionData.dimensionInfoIndexMap.findLastIndex(
    (idx) => idx === PSEUDO_DIMENSION_INDEX
  );

  const totalHeight = qSize.qcy * DEFAULT_ROW_HEIGHT * (pseudoDimensionIndex > -1 ? qMeasureInfo.length : 1);

  if (leftDimensionData.size.x === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {leftDimensionData.grid.map((list, colIndex) => {
        const isLastColumn = colIndex === leftDimensionData.size.x - 1;
        const isLastDimension = lastDimensionIndex === colIndex;
        const isPseudoDimension = colIndex === pseudoDimensionIndex;
        let itemCount = Object.keys(list).length;
        if (isPseudoDimension || isLastColumn) {
          itemCount = qSize.qcy;
        } else if (isLastDimension) {
          itemCount = qSize.qcy / qMeasureInfo.length;
        }
        const estimatedItemSize = totalHeight / itemCount;

        return (
          <VariableSizeList
            key={getKey(colIndex)}
            ref={setListRef(leftGridRef, colIndex)}
            style={isLastColumn ? { ...listStyle, ...rightListStyle } : listStyle}
            height={height}
            width={getLeftColumnWidth(colIndex)}
            itemCount={isLastColumn ? qSize.qcy : Object.keys(list).length}
            itemSize={getItemSizeCallback(list)}
            layout="vertical"
            itemData={{
              layoutService,
              dataModel,
              constraints,
              list,
              isLeftColumn: true,
              isLast: isLastColumn,
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
