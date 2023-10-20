import React from "react";
import { NxSelectionCellType } from "../../../../types/QIX";
import type { Cell, ListItemData } from "../../../../types/types";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import ColumnAdjuster from "../ColumnAdjuster";
import shouldRenderColumnAdjuster from "../utils/should-render-column-adjuster";
import Container from "./Container";
import ExpandOrCollapseIcon from "./ExpandOrCollapseIcon";
import InnerContainer from "./InnerContainer";
import Text from "./Text";

export interface DimensionCellProps {
  cell: Cell;
  style: React.CSSProperties;
  data: ListItemData;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showTotalCellDivider: boolean;
}

const DimensionValue = ({
  cell,
  style,
  isLeftColumn,
  data,
  isLastRow,
  isLastColumn,
  showTotalCellDivider,
}: DimensionCellProps): JSX.Element => {
  const { dataModel, layoutService } = data;
  const styleService = useStyleContext();
  const { isSelected, isActive } = useSelectionsContext();
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
      <InnerContainer isLeftColumn={isLeftColumn}>
        <ExpandOrCollapseIcon
          isLeftColumn={isLeftColumn}
          isCellSelected={isCellSelected}
          cell={cell}
          dataModel={dataModel}
        />
        <Text isLeftColumn={isLeftColumn} isCellSelected={isCellSelected} cell={cell} styleService={styleService}>
          {text}
        </Text>
      </InnerContainer>
      {columnAdjuster}
    </Container>
  );
};

export default DimensionValue;
