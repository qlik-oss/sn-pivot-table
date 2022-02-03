import React from "react";
import { DataModel } from "../../types/types";

interface FullSizeContainerProps {
  columnWidth: number;
  children: JSX.Element;
  dataModel: DataModel;
}

const DEFAULT_ROW_HEIGHT = 28;

const FullSizeContainer = ({ columnWidth, children, dataModel }: FullSizeContainerProps): JSX.Element => (
  <div
  style={{
    display: 'block',
    width: columnWidth * dataModel.pivotData.matrix.length,
    height: DEFAULT_ROW_HEIGHT * dataModel.pivotData.matrix[0]?.length
  }}
  >
    {children}
  </div>
);

export default FullSizeContainer;
