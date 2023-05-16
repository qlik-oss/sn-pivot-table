import type { stardust } from "@nebula.js/stardust";
import React, { memo, useLayoutEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import type { DataModel, LayoutService, TopDimensionData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import useOnPropsChange from "../../hooks/use-on-props-change";
import MemoizedListCellFactory from "../cells/ListCellFactory";
import getItemKey from "../helpers/get-item-key";
import { getColumnWidthHandler } from "../helpers/get-item-size-handler";
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
  willChange: "auto",
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
  const {
    grid: { divider },
    headerCellHeight,
  } = useStyleContext();
  const { qMeasureInfo, qDimensionInfo } = layoutService.layout.qHyperCube;
  const resolvedContainerStyle = {
    ...(layoutService.hasLeftDimensions ? containerStyle : containerStyleWithoutBorders),
    borderColor: divider,
  };

  useOnPropsChange(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.resetAfterIndex(0, false));
    }
  }, [dataModel, width, height, topDimensionData, topGridRef, headerCellHeight]);

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.scrollTo(getScrollLeft()));
    }
  }, [layoutService, getScrollLeft, topGridRef]);

  const allMeasuresWidth = useMemo(
    () => qMeasureInfo.reduce((totalWidth, measure, index) => totalWidth + getMeasureInfoWidth(index), 0),
    [getMeasureInfoWidth, qMeasureInfo]
  );

  const totalWidth = layoutService.size.x * (allMeasuresWidth / qMeasureInfo.length);

  if (topDimensionData.rowCount === 0) {
    // An empty top grid needs to occupy space to properly render headers given there is no top data
    return <div style={{ width, height, ...containerStyle }} />;
  }

  return (
    <div style={resolvedContainerStyle}>
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
            itemSize={getColumnWidthHandler({ list, isLastRow, layoutService, getMeasureInfoWidth, allMeasuresWidth })}
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
