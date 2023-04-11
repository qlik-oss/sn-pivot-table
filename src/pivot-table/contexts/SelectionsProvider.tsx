import { createContext, useContext } from "react";
// import useDebug from '../hooks/use-debug';
import { ExtendedSelections } from "../../types/types";
import useSelectionsModel, { SelectionModel } from "../hooks/use-selections-model";

interface SelectionsProviderProps {
  children: JSX.Element | JSX.Element[];
  selections: ExtendedSelections;
}

const NOOP_SELECTIONS_MODEL = {
  select: () => () => {},
  isSelected: () => false,
  isActive: false,
  isLocked: () => false,
};

const SelectionsContext = createContext<SelectionModel>(NOOP_SELECTIONS_MODEL);

export const useSelectionsContext = (): SelectionModel => useContext(SelectionsContext);

export default function SelectionsProvider({ children, selections }: SelectionsProviderProps): JSX.Element {
  const selectionsModel = useSelectionsModel(selections);
  // useDebug('SelectionsProvider', { ...selectionsModel });

  return <SelectionsContext.Provider value={selectionsModel}>{children}</SelectionsContext.Provider>;
}
