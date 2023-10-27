import React from "react";
import { areEqual } from "react-window";
import type { ListItemData } from "../../../../types/types";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import { shouldShowTotalCellDivider } from "../../../hooks/use-is-total-cell";
import ColumnAdjuster from "../ColumnAdjuster";
import EmptyCell from "../EmptyCell";
import shouldRenderColumnAdjuster from "../utils/should-render-column-adjuster";
import Container from "./Container";
import ExpandOrCollapseIcon from "./ExpandOrCollapseIcon";
import StickyCellContainer from "./StickyCellContainer";
import Text from "./Text";
import getCell from "./utils/get-cell";

export interface DimensionValueProps {
  index: number;
  style: React.CSSProperties;
  data: ListItemData;
}

const DimensionValue = ({ index, style, data }: DimensionValueProps): JSX.Element => {
  const styleService = useStyleContext();
  const { isSelected, isActive } = useSelectionsContext();
  const { dataModel, layoutService, isLeftColumn = false, showLastBorder, itemCount, isLast, totalDividerIndex } = data;
  const cell = getCell(index, data);
  const isLastRow = isLeftColumn ? index === itemCount - 1 : isLast;
  const isLastColumn = isLeftColumn ? isLast : index === itemCount - 1;
  const showTotalCellDivider = shouldShowTotalCellDivider(cell, totalDividerIndex);

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

  const isCellSelected = isSelected(cell);
  const text = cell.isNull ? layoutService.getNullValueText() : cell.ref.qText;

  return (
    <Container
      text={text}
      reactWindowStyle={style}
      isLeftColumn={isLeftColumn}
      isLastRow={isLastRow}
      isLastColumn={isLastColumn}
      isCellSelected={isCellSelected}
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
      <ColumnAdjuster
        cellInfo={cell}
        columnWidth={style.width as number}
        dataModel={dataModel}
        isLastColumn={isLastColumn}
        isLastRow={isLastRow}
      />
    </Container>
  );
};

export default React.memo(DimensionValue, areEqual);
