/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Q_PATH } from "../../constants";
import { NxSelectionCellType } from "../../types/QIX";
import type { Cell, ExtendedSelections, PageInfo } from "../../types/types";

export type SelectionCellLoopup = (cell: Cell) => boolean;

export interface SelectionModel {
  select: (cell: Cell) => (evt: React.MouseEvent) => Promise<void>;
  isSelected: SelectionCellLoopup;
  isActive: boolean;
  isLocked: SelectionCellLoopup;
}

export interface SelectedPivotCell {
  qType: string;
  qRow: number;
  qCol: number;
}

export default function useSelectionsModel(
  selections: ExtendedSelections,
  updatePageInfo: (args: Partial<PageInfo>) => void,
): SelectionModel {
  const isActive = selections.isActive();
  const [selectedPivotCells, setSelectedPivotCells] = useState<SelectedPivotCell[]>([]);

  useEffect(() => {
    const clearSelections = () => setSelectedPivotCells([]);
    const clearSelectionAndResetPage = () => {
      setSelectedPivotCells([]);
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
      switch (cell.selectionCellType) {
        case NxSelectionCellType.NX_CELL_LEFT:
          return selectedPivotCells.some(
            (
              selectedPivotCell, // TODO Put this in new state? Quiker lookup?
            ) =>
              selectedPivotCell.qType === NxSelectionCellType.NX_CELL_TOP ||
              (selectedPivotCell.qType === NxSelectionCellType.NX_CELL_LEFT && selectedPivotCell.qCol !== cell.x),
          );
        case NxSelectionCellType.NX_CELL_TOP:
          return selectedPivotCells.some(
            (selectedPivotCell) =>
              selectedPivotCell.qType === NxSelectionCellType.NX_CELL_LEFT ||
              (selectedPivotCell.qType === NxSelectionCellType.NX_CELL_TOP && selectedPivotCell.qRow !== cell.y),
          );
        default:
          return false;
      }
    },
    [selectedPivotCells],
  );

  const select = useCallback(
    (cell: Cell) => async (evt: React.MouseEvent) => {
      if ((evt.target as HTMLElement)?.className.includes("sn-pivot-table-column-adjuster")) {
        return;
      }

      if (!selections.isActive()) {
        await selections.begin([Q_PATH]);
      }

      if (isLocked(cell)) {
        return;
      }

      setSelectedPivotCells((prevSelectedPivotCells) => {
        const nextSelectedPivotCells = [...prevSelectedPivotCells];
        const idx = nextSelectedPivotCells.findIndex(
          (selectedPivotCell) =>
            selectedPivotCell.qType === cell.selectionCellType &&
            selectedPivotCell.qRow === cell.y &&
            selectedPivotCell.qCol === cell.x,
        );

        if (idx > -1) {
          nextSelectedPivotCells.splice(idx, 1);
        } else {
          nextSelectedPivotCells.push({ qType: cell.selectionCellType, qRow: cell.y, qCol: cell.x });
        }

        selections
          .select({
            method: "selectPivotCells",
            params: [Q_PATH, nextSelectedPivotCells],
          })
          .catch(() => {});

        return nextSelectedPivotCells;
      });
    },
    [selections, isLocked],
  );

  const isSelected = useCallback(
    (cell: Cell) =>
      !!selectedPivotCells.find(
        (selectedPivotCell) =>
          selectedPivotCell.qType === cell.selectionCellType &&
          selectedPivotCell.qRow === cell.y &&
          selectedPivotCell.qCol === cell.x,
      ),
    [selectedPivotCells],
  );

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
