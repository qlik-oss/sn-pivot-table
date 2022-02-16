import { stardust } from '@nebula.js/stardust';
import React, { createContext, useContext } from 'react';
import useSelectionsModel, { SelectionModel } from '../hooks/use-selections-model';

interface SelectionsProviderProps {
  children: JSX.Element | JSX.Element[],
  selections: stardust.ObjectSelections
}

const NOOP_CONTEXT = { select: () => () => {}, isSelected: () => false, isActive: false };

const SelectionsContext = createContext<SelectionModel>(NOOP_CONTEXT);

export const useSelectionsContext = (): SelectionModel => useContext(SelectionsContext);

export default function SelectionsProvider({ children, selections }: SelectionsProviderProps): JSX.Element {
  const selectionsModel = useSelectionsModel(selections);

  return (
    <SelectionsContext.Provider value={selectionsModel}>
      {children}
    </SelectionsContext.Provider>
  );
}
