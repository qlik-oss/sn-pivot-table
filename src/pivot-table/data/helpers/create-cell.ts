import NxDimCellType from "../../../types/QIX";
import type { Cell, VisibleDimensionInfo } from "../../../types/types";

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
  dimensionInfo: VisibleDimensionInfo
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
    children: [],
    leafCount: isSnapshot ? 0 : node.qUp + node.qDown,
    distanceToNextCell: 0,
    isLockedByDimension: !!(typeof dimensionInfo === "object" && dimensionInfo.qLocked),
    incrementLeafCount() {
      this.leafCount += 1;
      if (parent) {
        parent.incrementLeafCount();
      }
    },
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
      return parent?.children[parent.children.length - 1] === cell && parent.isLastChild;
    },
  };

  parent?.children.push(cell);

  return cell;
};

export default createCell;
