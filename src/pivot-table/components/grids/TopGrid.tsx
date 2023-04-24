import { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { DataModel, LayoutService, List, TopDimensionData } from "../../../types/types";
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

  const getItemSizeCallback = (list: List, isLast: boolean) => (colIndex: number) => {
    const cell = isLast ? list[colIndex] : Object.values(list)[colIndex];

    if (cell?.leafCount > 0) {
      const measureInfoCount = qMeasureInfo.length;
      return ((cell.leafCount + cell.distanceToNextCell) / measureInfoCount) * allMeasuresWidth;
    }

    return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell?.x ?? colIndex));
  };

  const getKey = (rowIndex: number): string => {
    const dimIndex = topDimensionData.dimensionInfoIndexMap[rowIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return "-1";
    }
    return `${qDimensionInfo[dimIndex].qFallbackTitle}-${dimIndex}`;
  };

  const lastDimensionIndex = topDimensionData.dimensionInfoIndexMap.findLastIndex(
    (idx) => idx !== PSEUDO_DIMENSION_INDEX
  );

  const pseudoDimensionIndex = topDimensionData.dimensionInfoIndexMap.findLastIndex(
    (idx) => idx === PSEUDO_DIMENSION_INDEX
  );

  const totalWidth = qSize.qcx * (allMeasuresWidth / qMeasureInfo.length);

  if (topDimensionData.size.y === 0) {
    // An empty top grid needs to occupy space to properly render headers given there is no top data
    return <div style={{ width, height, ...bottomListStyle }} />;
  }

  return (
    <div>
      {topDimensionData.grid.map((list, topRowIndex) => {
        const isLastRow = topRowIndex === topDimensionData.size.y - 1;
        const isLastDimension = lastDimensionIndex === topRowIndex;
        const isPseudoDimension = topRowIndex === pseudoDimensionIndex;
        let itemCount = Object.keys(list).length;
        let estimatedItemSize;
        if (isLastRow) {
          itemCount = qSize.qcx;
          estimatedItemSize = totalWidth / itemCount; // Only need estimated size for the last list, as it does not already contains all the values
        } else if (isLastDimension) {
          // Last list is pseudo dimension
          itemCount = qSize.qcx / qMeasureInfo.length;
        }

        console.log("%c TOP LIST", "color: orange", {
          itemCount,
          list,
          isLastRow,
          isLastDimension,
          isPseudoDimension,
          totalWidth,
        });

        return (
          <VariableSizeList
            key={getKey(topRowIndex)}
            ref={setListRef(topGridRef, topRowIndex)}
            style={isLastRow ? { ...listStyle, ...bottomListStyle } : listStyle}
            height={rowHightCallback()}
            width={width}
            itemCount={itemCount}
            itemSize={getItemSizeCallback(list, isLastRow)}
            layout="horizontal"
            itemData={{
              layoutService,
              dataModel,
              constraints,
              list,
              isLast: isLastRow || isLastDimension,
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

export default memo(TopGrid);
