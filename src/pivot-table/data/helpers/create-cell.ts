import NxDimCellType from "../../../types/QIX";
import type { Cell, VisibleDimensionInfo } from "../../../types/types";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../../constants";

// qElemNo === -1 => Total
// qElemNo === -2 => Null
// qElemNo === -3 => Others
// qElemNo === -4 => Empty

const countLeafNodes = (count: number, node: EngineAPI.INxPivotDimensionCell): number =>
  node.qSubNodes.reduce((acc, childNode) => {
    if (childNode.qSubNodes.length === 0) {
      return acc + 1;
    }
    return countLeafNodes(acc, childNode);
  }, count);

const getLeafCount = (
  node: EngineAPI.INxPivotDimensionCell,
  pageY: number,
  pageX: number,
  isSnapshot: boolean,
  isLeftColumn: boolean,
) => {
  if (isSnapshot) {
    return countLeafNodes(0, node);
  }

  // If a node is at the end of a page and has more child nodes at the next page.
  // Those child nodes should not me included in the leaf count.
  const maxLeafCount = isLeftColumn ? MAX_ROW_COUNT - pageY : MAX_COLUMN_COUNT - pageX;
  // Leaf count is per PAGE, so if the node is the first node on a page. Ignore any nodes on previous page.
  const nbrOfLeafNodesThatCanBeFetched = isLeftColumn && pageY === 0 ? node.qDown : node.qUp + node.qDown;

  return Math.min(maxLeafCount, countLeafNodes(nbrOfLeafNodesThatCanBeFetched, node));
};

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  pageY: number,
  isSnapshot: boolean,
  dimensionInfo: VisibleDimensionInfo,
  isLeftColumn = true,
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
    /**
     * Children are positioned based on their page coordinate (pageX or pageY),
     * this means that the children array might have a child at first position
     * and at position 50, but no children between.
     *
     * This is because children are added in a non-linear order as data is fetched.
     */
    children: [] as Cell[],
    isLeafNode: node.qSubNodes.length === 0,
    leafCount: getLeafCount(node, pageY, x, isSnapshot, isLeftColumn),
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

  if (parent) {
    const pageDir = isLeftColumn ? "pageY" : "pageX";
    // eslint-disable-next-line no-param-reassign
    parent.children[cell[pageDir] - parent[pageDir]] = cell;
  }

  return cell;
};

export default createCell;
