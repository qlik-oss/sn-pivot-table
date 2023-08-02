import type { stardust } from "@nebula.js/stardust";
import { useOnPropsChange } from "@qlik-oss/nebula-table-utils/lib/hooks";
import React, { memo, useLayoutEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import type { DataModel, LayoutService, TopDimensionData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
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
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  getScrollLeft: () => number;
  layoutService: LayoutService;
  topDimensionData: TopDimensionData;
  showLastRowBorderBottom: boolean;
  getLeafWidth: (index?: number) => number;
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
  rowHightCallback,
  width,
  height,
  constraints,
  getScrollLeft,
  layoutService,
  topDimensionData,
  showLastRowBorderBottom,
  getLeafWidth,
}: TopGridProps): JSX.Element | null => {
  const {
    grid: { divider },
    headerCellHeight,
  } = useStyleContext();
  const { qDimensionInfo } = layoutService.layout.qHyperCube;
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

  const totalWidth = layoutService.size.x * getLeafWidth();

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
            itemSize={getColumnWidthHandler({ list, isLastRow, getLeafWidth })}
            layout="horizontal"
            itemData={{
              layoutService,
              dataModel,
              constraints,
              list,
              isLast: isLastRow && !layoutService.layout.snapshotData,
              itemCount,
              showLastRowBorderBottom,
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
