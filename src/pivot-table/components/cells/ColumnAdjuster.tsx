import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { ColumnWidthType } from "../../../types/QIX";
import type { ApplyColumnWidth, Cell } from "../../../types/types";
import { ColumnWidthValues } from "../../hooks/use-column-width";
import { AdjusterBorder, AdjusterHitArea } from "./styles";

interface AdjusterProps {
  cell: Cell;
  columnWidth: number;
  applyColumnWidth: ApplyColumnWidth;
  // isLastColumn: boolean;
  // onColumnResize: () => void.
  // interactions
}

/**
 * Component that is placed on top of column border.
 * The vertical borders in the header can be used to change the column width.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging the current column is updated, and on mouse up all other columns are updated.
 */
const ColumnAdjuster = ({ cell, columnWidth, applyColumnWidth }: AdjusterProps) => {
  const tempWidth = useRef({ initWidth: 0, columnWidth: 0, initX: 0 });
  const [marginLeft, setMarginLeft] = useState(-4);
  // if (!interactions.active) return null;

  useEffect(() => setMarginLeft(-4), [cell]);

  const confirmWidth = () => {
    if (tempWidth.current.columnWidth !== tempWidth.current.initWidth) {
      const newWidthData = { type: ColumnWidthType.Pixels, pixels: tempWidth.current.columnWidth };
      applyColumnWidth(newWidthData, cell);
    }
  };

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidth.current.initX;
    const adjustedWidth = Math.max(tempWidth.current.initWidth + deltaWidth, ColumnWidthValues.PixelsMin);
    setMarginLeft(deltaWidth - 4);
    tempWidth.current.columnWidth = adjustedWidth;
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    preventDefaultBehavior(evt);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    confirmWidth();
  };

  const mouseDownHandler = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    evt.preventDefault();

    tempWidth.current = {
      initX: evt.clientX,
      initWidth: columnWidth,
      columnWidth,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  // const clickHandler = (evt: React.MouseEvent) => preventDefaultBehavior(evt as unknown as MouseEvent);

  const handleDoubleClick = () => applyColumnWidth({ type: ColumnWidthType.FitToContent }, cell);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <AdjusterHitArea
      style={{ marginLeft }}
      isLastColumn={false}
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
