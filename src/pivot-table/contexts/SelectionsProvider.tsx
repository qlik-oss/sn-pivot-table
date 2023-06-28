import React, { createContext, useContext } from "react";
import type { ExtendedSelections, PageInfo } from "../../types/types";
import useSelectionsModel, { type SelectionModel } from "../hooks/use-selections-model";

interface SelectionsProviderProps {
  children: JSX.Element | JSX.Element[];
  selections: ExtendedSelections;
  updatePageInfo: (args: Partial<PageInfo>) => void;
}

const NOOP_SELECTIONS_MODEL = {
  select: () => () => Promise.resolve(),
  isSelected: () => false,
  isActive: false,
  isLocked: () => false,
};

const SelectionsContext = createContext<SelectionModel>(NOOP_SELECTIONS_MODEL);

export const useSelectionsContext = (): SelectionModel => useContext(SelectionsContext);

const SelectionsProvider = ({ children, selections, updatePageInfo }: SelectionsProviderProps): JSX.Element => {
  const selectionsModel = useSelectionsModel(selections, updatePageInfo);

  return <SelectionsContext.Provider value={selectionsModel}>{children}</SelectionsContext.Provider>;
};

export default SelectionsProvider;
