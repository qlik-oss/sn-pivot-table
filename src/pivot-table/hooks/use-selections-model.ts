import { useCallback, useEffect, useState, useMemo } from 'react';
import { Q_PATH } from '../../constants';
import { NxSelectionCellType } from '../../types/QIX';
import { ExtendedSelections } from '../../types/types';

export interface SelectionModel {
  select: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => () => void;
  isSelected: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
  isActive: boolean;
  isLocked: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
}

export interface SelectedPivotCell {
  qType: string;
  qRow: number;
  qCol: number;
}

export default function useSelectionsModel(selections: ExtendedSelections): SelectionModel {
  const [selected, setSelected] = useState<SelectedPivotCell[]>([]);

  useEffect(() => {
    const clearSelections = () => setSelected([]);
    const confirmOrCancelSelections = () => setSelected([]);
    selections.on('deactivated', clearSelections);
    selections.on('canceled', confirmOrCancelSelections);
    selections.on('confirmed', confirmOrCancelSelections);
    selections.on('cleared', clearSelections);

    return () => {
      selections.removeListener('deactivated', clearSelections);
      selections.removeListener('canceled', confirmOrCancelSelections);
      selections.removeListener('confirmed', confirmOrCancelSelections);
      selections.removeListener('cleared', clearSelections);
    };
  }, [selections]);

  const isLocked = useCallback(
    (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => {
      switch (qType) {
        case NxSelectionCellType.NX_CELL_LEFT:
          return !!selected.find(cell => {
            if (cell.qType === NxSelectionCellType.NX_CELL_TOP) return true;
            if (cell.qType === NxSelectionCellType.NX_CELL_LEFT && cell.qCol !== qCol) return true;
            return false;
          });
        case NxSelectionCellType.NX_CELL_TOP:
          return !!selected.find(cell => {
            if (cell.qType === NxSelectionCellType.NX_CELL_LEFT) return true;
            if (cell.qType === NxSelectionCellType.NX_CELL_TOP && cell.qRow !== qRow) return true;
            return false;
          });
        default:
          return false;
      }
    },
    [selected]
  );

  const select = useCallback((qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => () => {
    if (!selections.isActive()) {
      selections.begin([Q_PATH]);
    }

    if (isLocked(qType, qRow, qCol)) {
      return;
    }

    setSelected(prev => {
      const values = [...prev];
      const idx = values.findIndex(cell => cell.qType === qType && cell.qRow === qRow && cell.qCol === qCol);
      if (idx > -1) {
        values.splice(idx, 1);
      } else {
        values.push({ qType, qRow, qCol });
      }

      selections.select({
        method: 'selectPivotCells',
        params: [Q_PATH, values],
      });

      return values;
    });
  }, [selections, isLocked]);

  const isSelected = useCallback(
    (qType, qRow, qCol) => !!selected.find(cell => cell.qType === qType && cell.qRow === qRow && cell.qCol === qCol),
    [selected]
  );

  const model = useMemo(() => ({
    select,
    isSelected,
    isActive: selections.isActive(),
    isLocked
  }), [
    select,
    isSelected,
    selections.isActive(),
    isLocked
  ]);

  return model;
};
