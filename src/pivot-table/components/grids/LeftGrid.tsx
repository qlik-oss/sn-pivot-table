import { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect } from "react";
import { VariableSizeList, areEqual } from "react-window";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { Cell, DataModel, LayoutService, LeftDimensionData } from "../../../types/types";
import ListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
import setListRef from "../helpers/set-list-ref";
// import useDebug from '../../hooks/use-debug';
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

const getItemSizeCallback = (list: Cell[]) => (rowIndex: number) => {
  const cell = list[rowIndex];
  if (cell?.leafCount) {
    return cell.leafCount * DEFAULT_ROW_HEIGHT;
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
  const MemoizedListCellFactory = memo(ListCellFactory, areEqual);

  const { qDimensionInfo } = layoutService.layout.qHyperCube;

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.resetAfterIndex(0));
    }
  }, [dataModel, width, height, leftDimensionData, leftGridRef]);

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.scrollTo(getScrollTop()));
    }
  });

  const isLastColumn = (colIndex: number) => colIndex === leftDimensionData.data.length - 1;

  const getKey = (colIndex: number): string => {
    const dimIndex = leftDimensionData.dimensionInfoIndexMap[colIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return "-1";
    }

    if (dimIndex === undefined) {
      return "dimIndex";
    }

    const title = qDimensionInfo[dimIndex]?.qFallbackTitle ?? "";
    return `${title}-${dimIndex}`;
  };

  if (leftDimensionData.size.x === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {leftDimensionData.data.map((list, colIndex) => (
        <VariableSizeList
          key={getKey(colIndex)}
          ref={setListRef(leftGridRef, colIndex)}
          style={isLastColumn(colIndex) ? { ...listStyle, ...rightListStyle } : listStyle}
          height={height}
          width={getLeftColumnWidth(colIndex)}
          itemCount={list.length}
          itemSize={getItemSizeCallback(list)}
          layout="vertical"
          itemData={{
            layoutService,
            dataModel,
            constraints,
            list,
            isLeftColumn: true,
          }}
          itemKey={getItemKey}
        >
          {MemoizedListCellFactory}
        </VariableSizeList>
      ))}
    </div>
  );
};

export default memo(LeftGrid);
