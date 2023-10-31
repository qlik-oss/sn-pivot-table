import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useRef, useState } from "react";
import { ColumnWidthType } from "../../../types/QIX";
import type { AdjusterCellInfo, DataModel } from "../../../types/types";
import { GRID_BORDER } from "../../constants";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { ColumnWidthValues } from "../../hooks/use-column-width";
import { CELL_PADDING } from "../shared-styles";
import { AdjusterBorder, AdjusterHitArea, COLUMN_ADJUSTER_BORDER_CLASS, COLUMN_ADJUSTER_CLASS } from "./styles";

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
  const { isActive } = useSelectionsContext();
  const [internalWidth, setInternalWidth] = useState(columnWidth);
  const tempWidth = useRef({ initWidth: 0, columnWidth: 0, initX: 0 });
  const positionAdjustment = isLastColumn ? CELL_PADDING : CELL_PADDING + GRID_BORDER;
  const shouldRender = !isActive && cellInfo.canBeResized;

  useOnPropsChange(() => {
    if (shouldRender) setInternalWidth(columnWidth);
  }, [columnWidth]);

  if (!shouldRender) return null;

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
      dataModel?.applyColumnWidth(newWidthData, cellInfo);
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

  const handleDoubleClick = () => dataModel?.applyColumnWidth({ type: ColumnWidthType.FitToContent }, cellInfo);

  return (
    <AdjusterHitArea
      style={{ left: internalWidth - positionAdjustment }}
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
