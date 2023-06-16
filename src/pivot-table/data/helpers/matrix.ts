const create = <T>(rowCount: number, colCount: number): (T | null)[][] =>
  Array(rowCount)
    .fill(null)
    .map(() => Array.from({ length: colCount }, () => null));

const transpose = <T>(matrix: T[][]) => matrix[0].map((_col, i) => matrix.map((row) => row[i]));

export { create, transpose };
