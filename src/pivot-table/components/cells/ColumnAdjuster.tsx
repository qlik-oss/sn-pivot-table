import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useMemo, useState } from "react";
import { ColumnWidthType } from "../../../types/QIX";
import type { AdjusterCellInfo, DataModel } from "../../../types/types";
import { GRID_BORDER } from "../../constants";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { ColumnWidthValues, type OverrideLeftGridWidth } from "../../hooks/use-column-width";
import { CELL_PADDING } from "../shared-styles";
import { AdjusterBorder, AdjusterHitArea, COLUMN_ADJUSTER_BORDER_CLASS, COLUMN_ADJUSTER_CLASS } from "./styles";

interface AdjusterProps {
  cellInfo: AdjusterCellInfo;
  columnWidth: number;
  dataModel: DataModel | undefined;
  isLastColumn: boolean;
  overrideLeftGridWidth?: OverrideLeftGridWidth;
}
/**
 * Component that is placed on top of column border, to resize the columns.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging this components follows the pointer, and on mouse up all column widths are updated.
 */
const ColumnAdjuster = ({ cellInfo, columnWidth, dataModel, isLastColumn, overrideLeftGridWidth }: AdjusterProps) => {
  const { interactions } = useBaseContext();
  const { isActive } = useSelectionsContext();
  const [, forceRerender] = useState({});
  const positionAdjustment = isLastColumn ? CELL_PADDING : CELL_PADDING + GRID_BORDER;
  const shouldRender = cellInfo.canBeResized && !!interactions.active && !isActive;

  const tempWidth = useMemo(() => ({ initWidth: columnWidth, columnWidth, initX: 0 }), [columnWidth]);

  if (!shouldRender) return null;

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidth.initX;
    const adjustedWidth = Math.max(tempWidth.initWidth + deltaWidth, ColumnWidthValues.PixelsMin);
    forceRerender({});
    tempWidth.columnWidth = adjustedWidth;
    overrideLeftGridWidth?.(adjustedWidth, cellInfo.dimensionInfoIndex);
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    preventDefaultBehavior(evt);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    if (tempWidth.columnWidth !== tempWidth.initWidth) {
      const newWidthData = { type: ColumnWidthType.Pixels, pixels: tempWidth.columnWidth };
      dataModel?.applyColumnWidth(newWidthData, cellInfo);
    }
  };

  const mouseDownHandler = (evt: React.MouseEvent) => {
    evt.stopPropagation();

    tempWidth.initX = evt.clientX;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const handleDoubleClick = () => dataModel?.applyColumnWidth({ type: ColumnWidthType.FitToContent }, cellInfo);

  return (
    <AdjusterHitArea
      style={{ left: tempWidth.columnWidth - positionAdjustment }}
      isLastColumn={isLastColumn}
      className={COLUMN_ADJUSTER_CLASS}
      key={`adjuster-${cellInfo.dimensionInfoIndex}`}
      onMouseDown={mouseDownHandler}
      onDoubleClick={handleDoubleClick}
      data-testid={COLUMN_ADJUSTER_CLASS}
    >
      <AdjusterBorder className={COLUMN_ADJUSTER_BORDER_CLASS} />
    </AdjusterHitArea>
  );
};

export default ColumnAdjuster;
