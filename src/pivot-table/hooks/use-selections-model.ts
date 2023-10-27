/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Q_PATH } from "../../constants";
import { NxSelectionCellType } from "../../types/QIX";
import type { Cell, ExtendedSelections, PageInfo } from "../../types/types";
import cancelEventsFromColumnAdjuster from "../components/cells/utils/is-event-from-column-adjuster";

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

type SelectedField = {
  selectionCellType: NxSelectionCellType;
  coord: number;
};

const getNextState = (cell: Cell, selectedPivotCells: Set<Cell>, selectedField: SelectedField | null) => {
  const nextSelectedPivotCells = new Set(selectedPivotCells);

  if (nextSelectedPivotCells.has(cell)) {
    nextSelectedPivotCells.delete(cell);

    return {
      nextSelectedPivotCells,
      nextSelectedField: nextSelectedPivotCells.size === 0 ? null : selectedField,
    };
  }

  nextSelectedPivotCells.add(cell);

  return {
    nextSelectedPivotCells,
    nextSelectedField: {
      selectionCellType: cell.selectionCellType,
      coord: cell.selectionCellType === NxSelectionCellType.NX_CELL_LEFT ? cell.x : cell.y,
    },
  };
};

export default function useSelectionsModel(
  selections: ExtendedSelections,
  updatePageInfo: (args: Partial<PageInfo>) => void,
): SelectionModel {
  const isActive = selections.isActive();
  const [selectedPivotCells, setSelectedPivotCells] = useState<Set<Cell>>(new Set());
  const [selectedField, setSelectedField] = useState<SelectedField | null>(null);

  useEffect(() => {
    const clearSelections = () => {
      setSelectedField(null);
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

  /**
   * You can only do selections in one dimension field at the time. So if there are
   * ongoing selections in a field. All other fields are locked.
   */
  const isLocked = useCallback(
    (cell: Cell) => {
      if (selectedPivotCells.size === 0 || selectedField === null) {
        return false;
      }

      if (cell.selectionCellType !== selectedField.selectionCellType) {
        return true;
      }

      if (cell.selectionCellType === NxSelectionCellType.NX_CELL_LEFT) {
        return selectedField.coord !== cell.x;
      }

      return selectedField.coord !== cell.y;
    },
    [selectedPivotCells, selectedField],
  );

  const select = useCallback(
    (cell: Cell) => async (evt: React.MouseEvent) => {
      if (isEventFromColumnAdjuster(evt)) {
        return;
      }

      if (!selections.isActive()) {
        await selections.begin([Q_PATH]);
      }

      if (isLocked(cell)) {
        return;
      }

      const { nextSelectedPivotCells, nextSelectedField } = getNextState(cell, selectedPivotCells, selectedField);

      try {
        await selections.select({
          method: "selectPivotCells",
          params: [
            Q_PATH,
            Array.from(nextSelectedPivotCells, (c) => ({
              qType: c.selectionCellType,
              qRow: c.y,
              qCol: c.x,
            })),
          ],
        });

        setSelectedPivotCells(nextSelectedPivotCells);
        setSelectedField(nextSelectedField);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [selections, isLocked, selectedPivotCells, selectedField],
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
