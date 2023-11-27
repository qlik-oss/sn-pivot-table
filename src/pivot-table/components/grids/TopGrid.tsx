import React, { memo } from "react";
import { VariableSizeList } from "react-window";
import type {
  DataModel,
  LayoutService,
  ShowLastBorder,
  TopDimensionData,
  VisibleDimensionInfo,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { useResetListCache, useResetListCacheAndRerender } from "../../hooks/use-reset-list-cache";
import MemoizedDimensionValue from "../cells/DimensionValue";
import getItemKey from "../helpers/get-item-key";
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
  visibleTopDimensionInfo: VisibleDimensionInfo[];
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
  visibleTopDimensionInfo,
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

  useResetListCache(topGridRef, dataModel, topDimensionData);

  useResetListCacheAndRerender(topGridRef, width, height, headerCellHeight);

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
        const key = getKey(visibleTopDimensionInfo[topRowIndex]);

        return (
          <VariableSizeList
            key={key}
            ref={setListRef(topGridRef, topRowIndex)}
            style={listStyle}
            height={rowHightCallback()}
            width={width}
            itemCount={itemCount}
            itemSize={getColumnWidthHandler({ list, isLastRow, getRightGridColumnWidth })}
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
            itemKey={getItemKey}
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
