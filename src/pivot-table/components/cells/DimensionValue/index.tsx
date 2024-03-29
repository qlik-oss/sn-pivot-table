import React from "react";
import { areEqual } from "react-window";
import { ColumnWidthLocation, type ListItemData } from "../../../../types/types";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import useIsAdjustingWidth from "../../../hooks/use-is-adjusting-width";
import { shouldShowTotalCellDivider } from "../../../hooks/use-is-total-cell";
import ColumnAdjusterWrapper from "../ColumnAdjusterWrapper";
import EmptyCell from "../EmptyCell";
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
  const { isSelected } = useSelectionsContext();
  const { isAdjustingWidth, setIsAdjustingWidth } = useIsAdjustingWidth([data]);

  const { dataModel, isLeftColumn = false, showLastBorder, itemCount, isLast, totalDividerIndex } = data;
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

  return (
    <Container
      text={cell.ref.qText}
      reactWindowStyle={style}
      isLeftColumn={isLeftColumn}
      isLastRow={isLastRow}
      isLastColumn={isLastColumn}
      isCellSelected={isCellSelected}
      showTotalCellDivider={showTotalCellDivider}
      cell={cell}
      data={data}
      isAdjustingWidth={isAdjustingWidth}
    >
      <StickyCellContainer isLeftColumn={isLeftColumn}>
        <ExpandOrCollapseIcon
          isLeftColumn={isLeftColumn}
          isCellSelected={isCellSelected}
          cell={cell}
          dataModel={dataModel}
        />
        <Text isLeftColumn={isLeftColumn} isCellSelected={isCellSelected} cell={cell} styleService={styleService}>
          {cell.ref.qText}
        </Text>
      </StickyCellContainer>
      <ColumnAdjusterWrapper
        cellInfo={{
          ...cell,
          columnWidthLocation: cell.isPseudoDimension ? ColumnWidthLocation.Measures : ColumnWidthLocation.Dimension,
        }}
        columnWidth={style.width as number}
        dataModel={dataModel}
        isLastColumn={isLastColumn}
        setIsAdjustingWidth={setIsAdjustingWidth}
      />
    </Container>
  );
};

export default React.memo(DimensionValue, areEqual);
