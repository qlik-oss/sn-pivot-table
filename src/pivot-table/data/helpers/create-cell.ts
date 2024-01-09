import NxDimCellType, { NxSelectionCellType } from "../../../types/QIX";
import type { AttrExprInfoIndex, Cell, LayoutService, VisibleDimensionInfo } from "../../../types/types";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../../constants";
import getExpressionColor from "./get-expression-color";
import getRandomUUID from "./get-random-uuid";

// qElemNo === -1 => Total
// qElemNo === -2 => Null
// qElemNo === -3 => Others
// qElemNo === -4 => Empty

type Props = {
  node: EngineAPI.INxPivotDimensionCell;
  parent: Cell | null;
  root: Cell | null;
  x: number;
  y: number;
  pageY: number;
  dimensionInfo: VisibleDimensionInfo;
  attrExprInfoIndex: AttrExprInfoIndex;
  layoutService: LayoutService;
  isLeftColumn?: boolean;
  visibleMeasureInfoIndex: number;
};

const countLeafNodes = (count: number, node: EngineAPI.INxPivotDimensionCell): number =>
  node.qSubNodes.reduce((acc, childNode) => {
    if (childNode.qSubNodes.length === 0) {
      return acc + 1;
    }
    return countLeafNodes(acc, childNode);
  }, count);

const getLeafCount = (
  node: EngineAPI.INxPivotDimensionCell,
  y: number,
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
  let nbrOfLeafNodesThatCanBeFetched = node.qUp + node.qDown;
  // Leaf count is per PAGE, so if the node is the first node on a page. Ignore any nodes on previous page.
  if (isLeftColumn && pageY === 0) {
    const fetchTop = y + node.qUp; // qTop value when node was fetched
    const nbrOfRowsToFirstRowOnPage = fetchTop % MAX_ROW_COUNT;
    nbrOfLeafNodesThatCanBeFetched = node.qDown + nbrOfRowsToFirstRowOnPage;
  }

  return Math.min(maxLeafCount, countLeafNodes(nbrOfLeafNodesThatCanBeFetched, node));
};

const createCell = ({
  node,
  parent,
  root,
  x,
  y,
  pageY,
  layoutService,
  dimensionInfo,
  attrExprInfoIndex,
  isLeftColumn = true,
  visibleMeasureInfoIndex,
}: Props): Cell => {
  const isPseudoDimension = node.qType === NxDimCellType.NX_DIM_CELL_PSEUDO;

  const cell = {
    id: getRandomUUID(),
    ref: node,
    x,
    y,
    // pageX might change to reflect x in current x axis page
    // when we implement horizontal pagination feature (exactly like the relation btw y and pageY)
    pageX: x,
    pageY,
    mainAxisPageCoord: isLeftColumn ? pageY : x,
    isLeftColumn,
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
    leafCount: getLeafCount(node, y, pageY, x, layoutService.isSnapshot, isLeftColumn),
    distanceToNextCell: 0,
    isLockedByDimension: !!(typeof dimensionInfo === "object" && dimensionInfo.qLocked),
    // Having "parent.isTotal" means that it's enough that any ancestors is a total cell,
    // which is needed for the Total cell highlight use case.
    isTotal: node.qType === NxDimCellType.NX_DIM_CELL_TOTAL || !!parent?.isTotal,
    isEmpty: node.qType === NxDimCellType.NX_DIM_CELL_EMPTY,
    isNull: node.qType === NxDimCellType.NX_DIM_CELL_NULL,
    isPseudoDimension,
    expressionColor: getExpressionColor(attrExprInfoIndex, node),
    selectionCellType: isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP,
    dimensionInfoIndex: layoutService.getDimensionInfoIndex(dimensionInfo),
    canBeResized: node.qSubNodes.length === 0 && !isLeftColumn,
    visibleMeasureInfoIndex: isPseudoDimension ? visibleMeasureInfoIndex : parent?.visibleMeasureInfoIndex ?? -1,
  };

  if (parent) {
    // eslint-disable-next-line no-param-reassign
    parent.children[cell.mainAxisPageCoord - parent.mainAxisPageCoord] = cell;
  }

  return cell;
};

export default createCell;
