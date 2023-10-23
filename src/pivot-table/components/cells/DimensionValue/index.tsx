import React from "react";
import { areEqual } from "react-window";
import { NxSelectionCellType } from "../../../../types/QIX";
import type { ListItemData } from "../../../../types/types";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import ColumnAdjuster from "../ColumnAdjuster";
import EmptyCell from "../EmptyCell";
import shouldRenderColumnAdjuster from "../utils/should-render-column-adjuster";
import Container from "./Container";
import ExpandOrCollapseIcon from "./ExpandOrCollapseIcon";
import StickyCellContainer from "./StickyCellContainer";
import Text from "./Text";
import getCell from "./utils/get-cell";

export interface DimensionCellProps {
  index: number;
  style: React.CSSProperties;
  data: ListItemData;
}

const DimensionValue = ({ index, style, data }: DimensionCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { isSelected, isActive } = useSelectionsContext();
  const { dataModel, layoutService, isLeftColumn = false, showLastBorder } = data;
  const { cell, isLastRow, isLastColumn, showTotalCellDivider } = getCell(index, data);

  if (cell === undefined) {
    const { background } = styleService.dimensionValues;

    return (
      <EmptyCell
        style={{ ...style, background }}
        index={index}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
        showLastBorder={showLastBorder}
        isLeftColumn={isLeftColumn}
        showTotalCellDivider={showTotalCellDivider}
      />
    );
  }

  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const isCellSelected = isSelected(selectionCellType, cell.y, cell.x);
  const text = cell.isNull ? layoutService.getNullValueText() : cell.ref.qText;

  const columnAdjuster = shouldRenderColumnAdjuster(cell, isActive) ? (
    <ColumnAdjuster cell={cell} columnWidth={style.width as number} dataModel={dataModel} />
  ) : null;

  return (
    <Container
      text={text}
      reactWindowStyle={style}
      isLeftColumn={isLeftColumn}
      isLastRow={isLastRow}
      isLastColumn={isLastColumn}
      showTotalCellDivider={showTotalCellDivider}
      cell={cell}
      data={data}
    >
      <StickyCellContainer isLeftColumn={isLeftColumn}>
        <ExpandOrCollapseIcon
          isLeftColumn={isLeftColumn}
          isCellSelected={isCellSelected}
          cell={cell}
          dataModel={dataModel}
        />
        <Text isLeftColumn={isLeftColumn} isCellSelected={isCellSelected} cell={cell} styleService={styleService}>
          {text}
        </Text>
      </StickyCellContainer>
      {columnAdjuster}
    </Container>
  );
};

export default React.memo(DimensionValue, areEqual);
