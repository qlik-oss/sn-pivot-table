/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Q_PATH } from "../../constants";
import { NxSelectionCellType } from "../../types/QIX";
import type { ExtendedSelections, PageInfo } from "../../types/types";

export type IsCellSelect = (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;

export interface SelectionModel {
  select: (
    qType: EngineAPI.NxSelectionCellType,
    qRow: number,
    qCol: number,
  ) => (evt: React.MouseEvent) => Promise<void>;
  isSelected: IsCellSelect;
  isActive: boolean;
  isLocked: IsCellSelect;
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
  const [selected, setSelected] = useState<SelectedPivotCell[]>([]);

  useEffect(() => {
    const clearSelections = () => setSelected([]);
    const clearSelectionAndResetPage = () => {
      setSelected([]);
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
    (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => {
      switch (qType) {
        case NxSelectionCellType.NX_CELL_LEFT:
          return !!selected.find(
            (cell) =>
              cell.qType === NxSelectionCellType.NX_CELL_TOP ||
              (cell.qType === NxSelectionCellType.NX_CELL_LEFT && cell.qCol !== qCol),
          );
        case NxSelectionCellType.NX_CELL_TOP:
          return !!selected.find(
            (cell) =>
              cell.qType === NxSelectionCellType.NX_CELL_LEFT ||
              (cell.qType === NxSelectionCellType.NX_CELL_TOP && cell.qRow !== qRow),
          );
        default:
          return false;
      }
    },
    [selected],
  );

  const select = useCallback(
    (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => async (evt: React.MouseEvent) => {
      if ((evt.target as HTMLElement)?.className.includes("sn-pivot-table-column-adjuster")) {
        return;
      }

      if (!selections.isActive()) {
        await selections.begin([Q_PATH]);
      }

      if (isLocked(qType, qRow, qCol)) {
        return;
      }

      setSelected((prev) => {
        const values = [...prev];
        const idx = values.findIndex((cell) => cell.qType === qType && cell.qRow === qRow && cell.qCol === qCol);
        if (idx > -1) {
          values.splice(idx, 1);
        } else {
          values.push({ qType, qRow, qCol });
        }

        selections
          .select({
            method: "selectPivotCells",
            params: [Q_PATH, values],
          })
          .catch(() => {});

        return values;
      });
    },
    [selections, isLocked],
  );

  const isSelected = useCallback(
    (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) =>
      !!selected.find((cell) => cell.qType === qType && cell.qRow === qRow && cell.qCol === qCol),
    [selected],
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
