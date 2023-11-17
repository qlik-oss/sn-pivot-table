import ColumnAdjuster, { type ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import React, { useState } from "react";
import type { AdjusterCellInfo, DataModel } from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { type OverrideLeftGridWidth } from "../../hooks/use-column-width";

interface AdjusterProps {
  cellInfo: AdjusterCellInfo;
  columnWidth: number;
  dataModel: DataModel | undefined;
  isLastColumn: boolean;
  overrideLeftGridWidth?: OverrideLeftGridWidth;
  setIsAdjustingWidth: (isAdjusting: boolean) => void;
}
/**
 * Component that is placed on top of column border, to resize the columns.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging this components follows the pointer, and on mouse up all column widths are updated.
 */
const ColumnAdjusterWrapper = ({
  cellInfo,
  columnWidth,
  dataModel,
  isLastColumn,
  overrideLeftGridWidth,
  setIsAdjustingWidth,
}: AdjusterProps) => {
  const { interactions } = useBaseContext();
  const { isActive } = useSelectionsContext();
  const [, forceRerender] = useState({});
  const shouldRender = cellInfo.canBeResized && !!interactions.active && !isActive;

  if (!shouldRender) return null;

  const updateWidth = (adjustedWidth: number) => {
    forceRerender({});
    if (overrideLeftGridWidth && cellInfo.colIdx) {
      overrideLeftGridWidth(adjustedWidth, cellInfo.colIdx);
    }
  };

  const confirmWidth = (newWidthData: ColumnWidth) => dataModel?.applyColumnWidth(newWidthData, cellInfo);

  return (
    <ColumnAdjuster
      isPivot
      columnWidth={columnWidth}
      isLastColumn={isLastColumn}
      keyValue={`adjuster-${cellInfo.dimensionInfoIndex}`}
      updateWidthCallback={updateWidth}
      confirmWidthCallback={confirmWidth}
      setIsAdjustingWidth={setIsAdjustingWidth}
    />
  );
};

export default ColumnAdjusterWrapper;
