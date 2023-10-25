import React from "react";
import type { Cell, DataModel, ExpandOrCollapser } from "../../../../types/types";
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

interface OnClickHandlerProps {
  cell: Cell;
  expandOrCollapse: ExpandOrCollapser;
}

const createOnClickHandler =
  ({ expandOrCollapse, cell }: OnClickHandlerProps) =>
  (e: React.SyntheticEvent) => {
    expandOrCollapse(cell.y, cell.x);
    e.stopPropagation();
  };

const ExpandOrCollapseIcon = ({ cell, dataModel, isLeftColumn, isCellSelected }: Props): JSX.Element | null => {
  const styleService = useStyleContext();
  const { interactions } = useBaseContext();
  const { isActive } = useSelectionsContext();

  if (!cell.ref.qCanExpand && !cell.ref.qCanCollapse) {
    return null;
  }

  const disableOnClickHandler = !interactions.active || isActive || !dataModel;
  const color = getColor({ cell, styleService, isCellSelected });
  const opacity = isActive ? 0.4 : 1.0;
  const Icon = cell.ref.qCanExpand ? PlusIcon : MinusIcon;

  if (disableOnClickHandler) {
    return <Icon color={color} opacity={opacity} />;
  }

  const onClickHandler = cell.ref.qCanExpand
    ? createOnClickHandler({
        expandOrCollapse: isLeftColumn ? dataModel.expandLeft : dataModel.expandTop,
        cell,
      })
    : createOnClickHandler({
        expandOrCollapse: isLeftColumn ? dataModel.collapseLeft : dataModel.collapseTop,
        cell,
      });

  return <Icon color={color} opacity={opacity} onClick={onClickHandler} />;
};

export default ExpandOrCollapseIcon;
