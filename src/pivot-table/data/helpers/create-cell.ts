import NxDimCellType from "../../../types/QIX";
import type { Cell, VisibleDimensionInfo } from "../../../types/types";
import { MAX_ROW_COUNT } from "../../constants";

// qElemNo === -1 => Total
// qElemNo === -2 => Null
// qElemNo === -3 => Others
// qElemNo === -4 => Empty

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  pageY: number,
  isSnapshot: boolean,
  dimensionInfo: VisibleDimensionInfo,
): Cell => {
  const cell = {
    ref: node,
    x,
    y,
    // pageX might change to reflect x in current x axis page
    // when we implement horizontal pagination feature (exactly like the relation btw y and pageY)
    pageX: x,
    pageY,
    parent,
    root,
    children: [] as Cell[],
    isLeafNode: node.qSubNodes.length === 0,
    get leafCount(): number {
      if (isSnapshot) {
        return 0;
      }

      if (cell.isLeafNode) {
        return 1;
      }

      // If a node is at the end of a page and has more child nodes at the next page.
      // Those child nodes should not me included in the leaf count.
      const maxRowLeafCount = MAX_ROW_COUNT - pageY;

      const nbrOfLeafNodes = cell.children.reduce((count, childCell) => count + childCell.leafCount, 0);

      // leafCount is per PAGE, so if the node is the first node on a page. Ignore any nodes on previous page.
      if (pageY === 0) {
        return Math.min(node.qDown + nbrOfLeafNodes, maxRowLeafCount);
      }

      return Math.min(node.qUp + node.qDown + nbrOfLeafNodes, maxRowLeafCount);
    },
    distanceToNextCell: 0,
    isLockedByDimension: !!(typeof dimensionInfo === "object" && dimensionInfo.qLocked),
    // Having "parent.isTotal" means that it's enough that any ancestors is a total cell,
    // which is needed for the Total cell highlight use case.
    isTotal: node.qType === NxDimCellType.NX_DIM_CELL_TOTAL || !!parent?.isTotal,
    isEmpty: node.qType === NxDimCellType.NX_DIM_CELL_EMPTY,
    isNull: node.qType === NxDimCellType.NX_DIM_CELL_NULL,
    isPseudoDimension: node.qType === NxDimCellType.NX_DIM_CELL_PSEUDO,
    // A getter because child nodes are added as cells are being created. It has to be resolved when it's called.
    get isLastChild(): boolean {
      // Root is considedered last child for the total cell divider use case
      if (root === null) {
        return true;
      }

      // Having "parent.isLastChild" means that all ancestors also have to be the last child,
      // which is needed for the Total cell divider use case.
      return parent?.children.at(-1) === cell && parent.isLastChild;
    },
  };

  parent?.children.push(cell);

  return cell;
};

export default createCell;
