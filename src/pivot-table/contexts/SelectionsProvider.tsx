import React, { createContext, useContext } from "react";
import { ExtendedSelections } from "../../types/types";
import useSelectionsModel, { SelectionModel } from "../hooks/use-selections-model";

interface SelectionsProviderProps {
  children: JSX.Element | JSX.Element[];
  selections: ExtendedSelections;
}

const NOOP_SELECTIONS_MODEL = {
  select: () => () => Promise.resolve(),
  isSelected: () => false,
  isActive: false,
  isLocked: () => false,
};

const SelectionsContext = createContext<SelectionModel>(NOOP_SELECTIONS_MODEL);

export const useSelectionsContext = (): SelectionModel => useContext(SelectionsContext);

const SelectionsProvider = ({ children, selections }: SelectionsProviderProps): JSX.Element => {
  const selectionsModel = useSelectionsModel(selections);

  return <SelectionsContext.Provider value={selectionsModel}>{children}</SelectionsContext.Provider>;
};

export default SelectionsProvider;
