import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { Cell, DataModel } from "../../../../types/types";
import { useBaseContext } from "../../../contexts/BaseProvider";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import MinusIcon from "../../icons/Minus";
import PlusIcon from "../../icons/Plus";
import { getColor } from "./utils/get-style";

type Props = {
  isLeftColumn: boolean;
  isCellSelected: boolean;
  cell: Cell;
  dataModel?: DataModel;
};

interface OnExpandOrCollapseProps {
  cell: Cell;
  isLeftColumn?: boolean;
  interactions: stardust.Interactions;
  dataModel?: DataModel;
  isActive: boolean;
}

const createOnExpand = ({ dataModel, isLeftColumn, cell, interactions, isActive }: OnExpandOrCollapseProps) => {
  if (!interactions.active || isActive || !dataModel) {
    return undefined;
  }

  const action = isLeftColumn ? dataModel.expandLeft : dataModel.expandTop;

  return (e: React.SyntheticEvent) => {
    action(cell.y, cell.x);
    e.stopPropagation();
  };
};

const createOnCollapse = ({ dataModel, isLeftColumn, interactions, isActive, cell }: OnExpandOrCollapseProps) => {
  if (!interactions.active || isActive || !dataModel) {
    return undefined;
  }

  const action = isLeftColumn ? dataModel.collapseLeft : dataModel.collapseTop;

  return (e: React.SyntheticEvent) => {
    action(cell.y, cell.x);
    e.stopPropagation();
  };
};

const ExpandOrCollapseIcon = ({ cell, dataModel, isLeftColumn, isCellSelected }: Props): JSX.Element | null => {
  const styleService = useStyleContext();
  const { interactions } = useBaseContext();
  const { isActive } = useSelectionsContext();

  if (cell.ref.qCanExpand) {
    return (
      <PlusIcon
        color={getColor({ cell, styleService, isCellSelected })}
        opacity={isActive ? 0.4 : 1.0}
        onClick={createOnExpand({
          dataModel,
          isLeftColumn,
          cell,
          interactions,
          isActive,
        })}
      />
    );
  }

  if (cell.ref.qCanCollapse) {
    return (
      <MinusIcon
        color={getColor({ cell, styleService, isCellSelected })}
        opacity={isActive ? 0.4 : 1.0}
        onClick={createOnCollapse({
          dataModel,
          isLeftColumn,
          cell,
          interactions,
          isActive,
        })}
      />
    );
  }

  return null;
};

export default ExpandOrCollapseIcon;
