import React, { memo } from "react";
import { VariableSizeList } from "react-window";
import type { DataModel, HeadersData, LayoutService, ShowLastBorder, TopDimensionData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { useResetListCache, useResetListCacheAndRerender } from "../../hooks/use-reset-list-cache";
import MemoizedDimensionValue from "../cells/DimensionValue";
import { getListIemKey } from "../helpers/get-item-key";
import { getColumnWidthHandler } from "../helpers/get-item-size-handler";
import getKey from "../helpers/get-key";
import getListMeta from "../helpers/get-list-meta";
import setListRef from "../helpers/set-list-ref";
import { borderStyle } from "../shared-styles";

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeList[]>;
  rowHightCallback: () => number;
  width: number;
  height: number;
  layoutService: LayoutService;
  topDimensionData: TopDimensionData;
  showLastBorder: ShowLastBorder;
  getRightGridColumnWidth: (index?: number) => number;
  headersData: HeadersData;
}

const listStyle: React.CSSProperties = {
  overflow: "hidden",
  willChange: "auto",
};

const containerStyle: React.CSSProperties = {
  ...borderStyle,
  borderWidth: "0px 0px 0px 1px",
};

const TopGrid = ({
  dataModel,
  topGridRef,
  rowHightCallback,
  width,
  height,
  layoutService,
  topDimensionData,
  showLastBorder,
  getRightGridColumnWidth,
  headersData,
}: TopGridProps): JSX.Element | null => {
  const {
    grid: { divider },
    headerCellHeight,
  } = useStyleContext();
  const resolvedContainerStyle = {
    ...containerStyle,
    borderColor: divider,
    height,
  };

  useResetListCache(topGridRef, topDimensionData);

  useResetListCacheAndRerender(topGridRef, width, height, headerCellHeight, layoutService);

  const totalWidth = layoutService.size.x * getRightGridColumnWidth();

  if (topDimensionData.rowCount === 0) {
    // An empty top grid needs to occupy space to properly render headers given there is no top data
    return <div style={{ width, height, ...containerStyle }} />;
  }

  return (
    <div style={resolvedContainerStyle}>
      {topDimensionData.grid.map((list, topRowIndex) => {
        const isLastRow = topRowIndex === topDimensionData.rowCount - 1;
        const { itemCount, estimatedItemSize, listValues } = getListMeta(
          list,
          totalWidth,
          layoutService.size.x,
          isLastRow,
        );
        const dimensionInfo = layoutService.getDimensionInfo(
          headersData.data[topRowIndex][headersData.size.x - 1]!.dimensionInfoIndex,
        );

        const key = dimensionInfo ? getKey(dimensionInfo) : `empty ${topRowIndex}`;

        return (
          <VariableSizeList
            key={key}
            ref={setListRef(topGridRef, topRowIndex)}
            style={listStyle}
            height={rowHightCallback()}
            width={width}
            itemCount={itemCount}
            itemSize={getColumnWidthHandler({ list, listValues, isLastRow, getRightGridColumnWidth })}
            layout="horizontal"
            itemData={{
              layoutService,
              dataModel,
              list,
              isLast: isLastRow && !layoutService.layout.snapshotData,
              itemCount,
              showLastBorder,
              listValues,
              totalDividerIndex: topDimensionData.totalDividerIndex,
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

export default memo(TopGrid);
