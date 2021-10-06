import { ColumnNode, Layout, PivotColumns, PivotTableData, QDimensionInfo } from '../types';

const addSubNodes = (
  leftColumns: PivotColumns,
  subNode: ColumnNode,
  column: number,
  qDimensionInfo: QDimensionInfo
) => {
  if (!leftColumns.headers[column]) {
    leftColumns.headers.push(qDimensionInfo[column]);
  }
  if (subNode.qElemNo > -1) {
    leftColumns.items.push({ ...subNode, column });
    subNode.qSubNodes.forEach((subSubNode) => {
      addSubNodes(leftColumns, subSubNode, column + 1, qDimensionInfo);
    });
  }
};

const handleSubNodes = (nodes: Array<ColumnNode>, qDimensionInfo: QDimensionInfo): PivotColumns => {
  const pivotColumns = { items: [], headers: [qDimensionInfo[0]] } as PivotColumns;
  nodes.forEach((row) => {
    pivotColumns.items.push({ ...row, column: 0 });
    if (!row.qCanExpand) {
      row.qSubNodes.forEach((subNode) => {
        addSubNodes(pivotColumns, subNode, 1, qDimensionInfo);
      });
    }
  });
  return pivotColumns;
};

export default async function manageData(layout: Layout): Promise<PivotTableData> {
  const { qDimensionInfo } = layout.qHyperCube;
  const { qTop, qLeft, qData } = layout.qHyperCube.qPivotDataPages[0];
  const leftColumns = handleSubNodes(qLeft, qDimensionInfo);
  const topColumns = handleSubNodes(qTop, qDimensionInfo);
  const rows = qData;

  return { rows, topColumns, leftColumns };
}
