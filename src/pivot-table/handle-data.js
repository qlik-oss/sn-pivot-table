const addSubNodes = (leftColumns, subNode, column, qDimensionInfo) => {
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

const handleSubNodes = (nodes, qDimensionInfo) => {
  const leftColumns = { items: [], headers: [qDimensionInfo[0]] };
  nodes.forEach((row) => {
    leftColumns.items.push({ ...row, column: 0 });
    if (!row.qCanExpand) {
      row.qSubNodes.forEach((subNode) => {
        addSubNodes(leftColumns, subNode, 1, qDimensionInfo);
      });
    }
  });
  return leftColumns;
};

export default async function manageData(layout) {
  const { qDimensionInfo } = layout.qHyperCube;
  const { qTop, qLeft, qData } = layout.qHyperCube.qPivotDataPages[0];
  const leftColumns = handleSubNodes(qLeft, qDimensionInfo);

  const rows = qData;

  return { size: layout.qHyperCube.qSize, rows, qTop, leftColumns };
}
