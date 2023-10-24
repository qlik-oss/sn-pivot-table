import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useRef, useState } from "react";
import { ColumnWidthType } from "../../../types/QIX";
import type { CellInfo, DataModel } from "../../../types/types";
import { GRID_BORDER } from "../../constants";
import { ColumnWidthValues } from "../../hooks/use-column-width";
import { CELL_PADDING } from "../shared-styles";
import { AdjusterBorder, AdjusterHitArea } from "./styles";

const POSITION_ADJUSTMENT = CELL_PADDING + GRID_BORDER;

interface AdjusterProps {
  cell: CellInfo;
  columnWidth: number;
  dataModel: DataModel | undefined;
  isLastColumn: boolean;
}

/**
 * Component that is placed on top of column border, to resize the columns.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging this components follows the pointer, and on mouse up all column widths are updated.
 */
const ColumnAdjuster = ({ cell, columnWidth, dataModel, isLastColumn }: AdjusterProps) => {
  const [internalWidth, setInternalWidth] = useState(columnWidth);
  const tempWidth = useRef({ initWidth: 0, columnWidth: 0, initX: 0 });

  useOnPropsChange(() => {
    setInternalWidth(columnWidth);
  }, [columnWidth]);

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidth.current.initX;
    const adjustedWidth = Math.max(tempWidth.current.initWidth + deltaWidth, ColumnWidthValues.PixelsMin);
    setInternalWidth(adjustedWidth);
    tempWidth.current.columnWidth = adjustedWidth;
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    preventDefaultBehavior(evt);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    if (tempWidth.current.columnWidth !== tempWidth.current.initWidth) {
      const newWidthData = { type: ColumnWidthType.Pixels, pixels: tempWidth.current.columnWidth };
      dataModel?.applyColumnWidth(newWidthData, cell);
    }
  };

  const mouseDownHandler = (evt: React.MouseEvent) => {
    evt.stopPropagation();

    tempWidth.current = {
      initX: evt.clientX,
      initWidth: columnWidth,
      columnWidth,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const handleDoubleClick = () => dataModel?.applyColumnWidth({ type: ColumnWidthType.FitToContent }, cell);

  return (
    <AdjusterHitArea
      style={{ left: internalWidth - POSITION_ADJUSTMENT }}
      isLastColumn={isLastColumn}
      className="sn-pivot-table-column-adjuster"
      key={`adjuster-${cell.x}`}
      onMouseDown={mouseDownHandler}
      onDoubleClick={handleDoubleClick}
      data-testid="sn-pivot-table-column-adjuster"
    >
      <AdjusterBorder className="sn-pivot-table-column-adjuster-border" />
    </AdjusterHitArea>
  );
};

export default ColumnAdjuster;
