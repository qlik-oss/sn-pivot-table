import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useMemo, useState } from "react";
import { ColumnWidthType } from "../../../types/QIX";
import type { AdjusterCellInfo, DataModel } from "../../../types/types";
import { GRID_BORDER } from "../../constants";
import { ColumnWidthValues } from "../../hooks/use-column-width";
import { CELL_PADDING } from "../shared-styles";
import { AdjusterBorder, AdjusterHitArea } from "./styles";

interface AdjusterProps {
  cellInfo: AdjusterCellInfo;
  columnWidth: number;
  dataModel: DataModel | undefined;
  isLastColumn: boolean;
}
/**
 * Component that is placed on top of column border, to resize the columns.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging this components follows the pointer, and on mouse up all column widths are updated.
 */
const ColumnAdjuster = ({ cellInfo, columnWidth, dataModel, isLastColumn }: AdjusterProps) => {
  const [, setInternalWidth] = useState(columnWidth);
  const positionAdjustment = isLastColumn ? CELL_PADDING : CELL_PADDING + GRID_BORDER;

  const tempWidth = useMemo(() => ({ initWidth: 0, columnWidth, initX: 0 }), [columnWidth]);

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidth.initX;
    const adjustedWidth = Math.max(tempWidth.initWidth + deltaWidth, ColumnWidthValues.PixelsMin);
    setInternalWidth(adjustedWidth);
    tempWidth.columnWidth = adjustedWidth;
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
    tempWidth.initWidth = columnWidth;
    tempWidth.columnWidth = columnWidth;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const handleDoubleClick = () => dataModel?.applyColumnWidth({ type: ColumnWidthType.FitToContent }, cellInfo);

  return (
    <AdjusterHitArea
      style={{ left: tempWidth.columnWidth - positionAdjustment }}
      isLastColumn={isLastColumn}
      className="sn-pivot-table-column-adjuster"
      key={`adjuster-${cellInfo.dimensionInfoIndex}`}
      onMouseDown={mouseDownHandler}
      onDoubleClick={handleDoubleClick}
      data-testid="sn-pivot-table-column-adjuster"
    >
      <AdjusterBorder className="sn-pivot-table-column-adjuster-border" />
    </AdjusterHitArea>
  );
};

export default ColumnAdjuster;
