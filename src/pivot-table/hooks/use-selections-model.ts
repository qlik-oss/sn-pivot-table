/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Q_PATH } from "../../constants";
import { NxSelectionCellType } from "../../types/QIX";
import type { Cell, ExtendedSelections, PageInfo } from "../../types/types";

export type SelectionCellLookup = (cell: Cell) => boolean;

export interface SelectionModel {
  select: (cell: Cell) => (evt: React.MouseEvent) => Promise<void>;
  isSelected: SelectionCellLookup;
  isActive: boolean;
  isLocked: SelectionCellLookup;
}

export interface SelectedPivotCell {
  qType: string;
  qRow: number;
  qCol: number;
}

type SelectedRowOrColumn = {
  selectionCellType: NxSelectionCellType | null;
  coord: number;
};

const getNextState = (cell: Cell, selectedPivotCells: Set<Cell>, selectedRowOrColumn: SelectedRowOrColumn) => {
  const nextSelectedPivotCells = new Set(selectedPivotCells);
  const nextSelectedRowOrColumn = { ...selectedRowOrColumn };

  if (nextSelectedPivotCells.has(cell)) {
    nextSelectedPivotCells.delete(cell);

    if (nextSelectedPivotCells.size === 0) {
      nextSelectedRowOrColumn.selectionCellType = null;
      nextSelectedRowOrColumn.coord = -1;
    }

    return {
      nextSelectedPivotCells,
      nextSelectedRowOrColumn,
    };
  }

  nextSelectedPivotCells.add(cell);
  nextSelectedRowOrColumn.selectionCellType = cell.selectionCellType;
  nextSelectedRowOrColumn.coord = cell.selectionCellType === NxSelectionCellType.NX_CELL_LEFT ? cell.x : cell.y;

  return {
    nextSelectedPivotCells,
    nextSelectedRowOrColumn,
  };
};

export default function useSelectionsModel(
  selections: ExtendedSelections,
  updatePageInfo: (args: Partial<PageInfo>) => void,
): SelectionModel {
  const isActive = selections.isActive();
  const [selectedPivotCells, setSelectedPivotCells] = useState<Set<Cell>>(new Set());
  const [selectedRowOrColumn, setSelectedRowOrColumn] = useState<SelectedRowOrColumn>({
    selectionCellType: null,
    coord: -1,
  });

  useEffect(() => {
    const clearSelections = () => {
      setSelectedRowOrColumn({ selectionCellType: null, coord: -1 });
      setSelectedPivotCells(new Set());
    };
    const clearSelectionAndResetPage = () => {
      clearSelections();
      updatePageInfo({ page: 0 });
    };
    selections.on("deactivated", clearSelections);
    selections.on("canceled", clearSelections);
    selections.on("confirmed", clearSelectionAndResetPage);
    selections.on("cleared", clearSelections);

    return () => {
      selections.removeListener("deactivated", clearSelections);
      selections.removeListener("canceled", clearSelections);
      selections.removeListener("confirmed", clearSelectionAndResetPage);
      selections.removeListener("cleared", clearSelections);
    };
  }, [selections, updatePageInfo]);

  const isLocked = useCallback(
    (cell: Cell) => {
      if (selectedPivotCells.size === 0 || selectedRowOrColumn.selectionCellType === null) {
        return false;
      }

      if (cell.selectionCellType !== selectedRowOrColumn.selectionCellType) {
        return true;
      }

      if (cell.selectionCellType === NxSelectionCellType.NX_CELL_LEFT) {
        return selectedRowOrColumn.coord !== cell.x;
      }

      return selectedRowOrColumn.coord !== cell.y;
    },
    [selectedPivotCells, selectedRowOrColumn],
  );

  const select = useCallback(
    (cell: Cell) => async (evt: React.MouseEvent) => {
      if ((evt.target as HTMLElement | SVGElement)?.getAttribute("class") === "sn-pivot-table-column-adjuster") {
        return;
      }

      if (!selections.isActive()) {
        await selections.begin([Q_PATH]);
      }

      if (isLocked(cell)) {
        return;
      }

      const { nextSelectedPivotCells, nextSelectedRowOrColumn } = getNextState(
        cell,
        selectedPivotCells,
        selectedRowOrColumn,
      );

      try {
        await selections.select({
          method: "selectPivotCells",
          params: [
            Q_PATH,
            Array.from(nextSelectedPivotCells).map((c) => ({
              qType: c.selectionCellType,
              qRow: c.y,
              qCol: c.x,
            })),
          ],
        });

        setSelectedPivotCells(nextSelectedPivotCells);
        setSelectedRowOrColumn(nextSelectedRowOrColumn);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [selections, isLocked, selectedPivotCells, selectedRowOrColumn],
  );

  const isSelected = useCallback((cell: Cell) => selectedPivotCells.has(cell), [selectedPivotCells]);

  const model = useMemo(
    () => ({
      select,
      isSelected,
      isActive,
      isLocked,
    }),
    [select, isSelected, isActive, isLocked],
  );

  return model;
}
