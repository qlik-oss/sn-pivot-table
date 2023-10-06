import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useRef, useState } from "react";
import { ColumnWidthType, type ColumnWidth } from "../../../types/QIX";
import type { ApplyColumnWidth } from "../../../types/types";
import { ColumnWidthValues } from "../../hooks/use-column-width";

interface AdjusterProps {
  columnIndex: number;
  columnWidth: number;
  applyColumnWidth: ApplyColumnWidth;
  isLastColumn: boolean;
  // onColumnResize: () => void.
  // interactions
}

/**
 * Component that is placed on top of column border.
 * The vertical borders in the header can be used to change the column width.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging the current column is updated, and on mouse up all other columns are updated.
 */
const ColumnAdjuster = ({ columnIndex, columnWidth, applyColumnWidth, isLastColumn }: AdjusterProps) => {
  const tempWidth = useRef({ initWidth: 0, columnWidth: 0, initX: 0 });
  // if (!interactions.active) return null;

  const updateWidth = (adjustedWidth: number) => {
    tempWidth.current.columnWidth = adjustedWidth;
  };

  const confirmWidth = () => {
    if (tempWidth.current.columnWidth !== tempWidth.current.initWidth) {
      const newWidthData = { type: ColumnWidthType.Pixels, pixels: tempWidth.current.columnWidth };
      applyColumnWidth(newWidthData, columnIndex);
    }
  };

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidth.current.initX;
    const adjustedWidth = Math.max(tempWidth.current.initWidth + deltaWidth, ColumnWidthValues.PixelsMin);
    updateWidth(adjustedWidth);
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    preventDefaultBehavior(evt);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    confirmWidth();
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

  // const handleDoubleClick = () => applyColumnWidths({ type: ColumnWidthTypes.FIT_TO_CONTENT }, column);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        display: "flex",
        position: "absolute",
        height: "100%",
        top: 0,
        left: `100%`,
        cursor: "col-resize",
        // last column padding, other double padding + border
        width: `8px`,
        justifyContent: "center",
        marginLeft: "-4px",
      }}
      className="sn-table-adjuster-hit-area"
      // isLastColumn={isLastColumn}
      key={`adjuster-${columnIndex}`}
      onMouseDown={mouseDownHandler}
      // onDoubleClick={handleDoubleClick}
      data-testid="sn-table-column-adjuster"
    >
      <div
        style={{ position: "absolute", height: "100%", width: "3px", backgroundColor: "red" }}
        className="sn-table-adjuster-head-border"
      />
    </div>
  );
};

export default ColumnAdjuster;
