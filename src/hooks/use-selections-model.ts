import { stardust } from '@nebula.js/stardust';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Q_PATH } from '../constants';

export interface SelectionModel {
  select: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => () => void;
  isSelected: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
  isActive: boolean;
}

export interface SelectedPivotCell {
  qType: string;
  qRow: number;
  qCol: number;
}

export default function useSelectionsModel(selections: stardust.ObjectSelections): SelectionModel {
  const [selected, setSelected] = useState<SelectedPivotCell[]>([]);

  useEffect(() => {
    const clearSelections = () => setSelected([]);
    selections.on('deactivated', clearSelections);
    selections.on('canceled', clearSelections);
    selections.on('confirmed', clearSelections);
    selections.on('cleared', clearSelections);
console.debug('add selection listeners');
    return () => {
      console.debug('remove selection listeners');
      selections.removeListener('deactivated', clearSelections);
      selections.removeListener('canceled', clearSelections);
      selections.removeListener('confirmed', clearSelections);
      selections.removeListener('cleared', clearSelections);
    };
  }, [selections]);

  const select = useCallback((qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => () => {
    if (!selections.isActive()) {
      selections.begin([Q_PATH]);
    }

    setSelected(prev => {
      const values = [...prev];
      const idx = values.findIndex(cell => cell.qCol === qCol && cell.qRow === qRow);
      if (idx > -1) {
        values.splice(idx, 1);
      } else {
        values.push({qType, qCol, qRow});
      }

      selections.select({
        method: 'selectPivotCells',
        params: [Q_PATH, values],
      });

      return values;
    });
  }, [selections]);

  const isSelected = useCallback(
    (qType, qRow, qCol) => !!selected.find(cell => cell.qType === qType && cell.qRow === qRow && cell.qCol === qCol),
    [selected]
  );

  const model = useMemo(() => ({
    select,
    isSelected,
    isActive: selections.isActive()
  }), [
    select,
    isSelected,
    selections.isActive()
  ]);

  return model;
};
