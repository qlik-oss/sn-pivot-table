import type { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import type { DataModel, LayoutService, List, TopDimensionData } from "../../../types/types";
import useOnPropsChange from "../../hooks/use-on-props-change";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
import getKey from "../helpers/get-key";
import getListMeta from "../helpers/get-list-meta";
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

const containerStyle: React.CSSProperties = {
  ...gridBorderStyle,
  borderWidth: "0px 0px 0px 1px",
};

const containerStyleWithoutBorders: React.CSSProperties = {
  ...gridBorderStyle,
  borderWidth: "0px",
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
  const { qMeasureInfo, qDimensionInfo } = layoutService.layout.qHyperCube;

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
    const measureInfoCount = qMeasureInfo.length;

    if (colIndex === 0 && cell?.x > 0) {
      return ((cell.leafCount + cell.x) / measureInfoCount) * allMeasuresWidth;
    }

    if (cell?.leafCount > 0) {
      return ((cell.leafCount + cell.distanceToNextCell) / measureInfoCount) * allMeasuresWidth;
    }

    return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell?.x ?? colIndex));
  };

  const totalWidth = layoutService.size.x * (allMeasuresWidth / qMeasureInfo.length);

  if (topDimensionData.rowCount === 0) {
    // An empty top grid needs to occupy space to properly render headers given there is no top data
    return <div style={{ width, height, ...containerStyle }} />;
  }

  return (
    <div style={layoutService.hasLeftDimensions ? containerStyle : containerStyleWithoutBorders}>
      {topDimensionData.grid.map((list, topRowIndex) => {
        const isLastRow = topRowIndex === topDimensionData.rowCount - 1;
        const { itemCount, estimatedItemSize } = getListMeta(list, totalWidth, layoutService.size.x, isLastRow);
        const key = getKey(topDimensionData.dimensionInfoIndexMap[topRowIndex], qDimensionInfo);

        return (
          <VariableSizeList
            key={key}
            ref={setListRef(topGridRef, topRowIndex)}
            style={listStyle}
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
              isLast: isLastRow && !layoutService.layout.snapshotData,
              itemCount,
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
