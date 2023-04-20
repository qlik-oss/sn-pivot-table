import { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { Cell, DataModel, LayoutService, TopDimensionData } from "../../../types/types";
import useOnPropsChange from "../../hooks/use-on-props-change";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
import setListRef from "../helpers/set-list-ref";
import { gridBorderStyle } from "../shared-styles";

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeList[]>;
  getMeasureInfoWidth: (index: number) => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  getScrollLeft: () => number;
  layoutService: LayoutService;
  topDimensionData: TopDimensionData;
}

const listStyle: React.CSSProperties = {
  overflow: "hidden",
};

const bottomListStyle: React.CSSProperties = {
  borderWidth: "0px 0px 1px 0px",
  ...gridBorderStyle,
};

const TopGrid = ({
  dataModel,
  topGridRef,
  getMeasureInfoWidth,
  rowHightCallback,
  width,
  height,
  constraints,
  getScrollLeft,
  layoutService,
  topDimensionData,
}: TopGridProps): JSX.Element | null => {
  const { qMeasureInfo, qDimensionInfo, qSize } = layoutService.layout.qHyperCube;

  useOnPropsChange(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.resetAfterIndex(0, false));
    }
  }, [dataModel, width, height, topDimensionData, topGridRef]);

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.scrollTo(getScrollLeft()));
    }
  }, [layoutService, getScrollLeft, topGridRef]);

  const allMeasuresWidth = useMemo(
    () => qMeasureInfo.reduce((totalWidth, measure, index) => totalWidth + getMeasureInfoWidth(index), 0),
    [getMeasureInfoWidth, qMeasureInfo]
  );

  const getItemSizeCallback = (list: Cell[], isLastRow: boolean) => (colIndex: number) => {
    const cell = list[colIndex];

    if (cell === undefined) {
      return isLastRow ? getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(colIndex)) : 0;
    }

    if (cell.leafCount > 0) {
      let distanceToNextCell = 0;
      if (cell.nextSibling) {
        distanceToNextCell = cell.nextSibling.x - (cell.x + cell.leafCount);
      }
      const measureInfoCount = qMeasureInfo.length;
      return ((cell.leafCount + distanceToNextCell) / measureInfoCount) * allMeasuresWidth;
    }

    return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell.x));
  };

  const getKey = (rowIndex: number): string => {
    const dimIndex = topDimensionData.dimensionInfoIndexMap[rowIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return "-1";
    }
    return `${qDimensionInfo[dimIndex].qFallbackTitle}-${dimIndex}`;
  };

  if (topDimensionData.size.y === 0) {
    // An empty top grid needs to occupy space to properly render headers given there is no top data
    return <div style={{ width, height, ...bottomListStyle }} />;
  }

  return (
    <div>
      {topDimensionData.grid.map((list, topRowIndex) => (
        <VariableSizeList
          key={getKey(topRowIndex)}
          ref={setListRef(topGridRef, topRowIndex)}
          style={topRowIndex === topDimensionData.data.length - 1 ? { ...listStyle, ...bottomListStyle } : listStyle}
          height={rowHightCallback()}
          width={width}
          itemCount={qSize.qcx}
          itemSize={getItemSizeCallback(list, topDimensionData.grid.length - 1 === topRowIndex)}
          layout="horizontal"
          itemData={{
            layoutService,
            dataModel,
            constraints,
            list,
          }}
          itemKey={getItemKey}
        >
          {MemoizedListCellFactory}
        </VariableSizeList>
      ))}
    </div>
  );
};

export default memo(TopGrid);
