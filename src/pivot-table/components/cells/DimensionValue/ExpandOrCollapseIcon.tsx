import MinusOutlineIcon from "@qlik-trial/sprout/icons/react/MinusOutline";
import PlusOutlineIcon from "@qlik-trial/sprout/icons/react/PlusOutline";
import React from "react";
import type { Cell, DataModel, ExpandOrCollapser } from "../../../../types/types";
import { PLUS_MINUS_ICON_SIZE } from "../../../constants";
import { useBaseContext } from "../../../contexts/BaseProvider";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import { getColor } from "./utils/get-style";

type Props = {
  isLeftColumn: boolean;
  isCellSelected: boolean;
  cell: Cell;
  dataModel?: DataModel;
};

interface OnClickHandlerProps {
  cell: Cell;
  expandOrCollapse?: ExpandOrCollapser;
}

export const testIdExpandIcon = "expand-icon";
export const testIdCollapseIcon = "collapse-icon";

const createOnClickHandler =
  ({ expandOrCollapse, cell }: OnClickHandlerProps) =>
  (e: React.SyntheticEvent) => {
    expandOrCollapse?.(cell.y, cell.x);
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
  const Icon = cell.ref.qCanExpand ? PlusOutlineIcon : MinusOutlineIcon;
  let expandOrCollapse: ExpandOrCollapser | undefined;

  if (cell.ref.qCanExpand) {
    expandOrCollapse = isLeftColumn ? dataModel?.expandLeft : dataModel?.expandTop;
  } else {
    expandOrCollapse = isLeftColumn ? dataModel?.collapseLeft : dataModel?.collapseTop;
  }

  return (
    <Icon
      opacity={opacity}
      color={color}
      data-testid={cell.ref.qCanExpand ? testIdExpandIcon : testIdCollapseIcon}
      height={PLUS_MINUS_ICON_SIZE}
      style={{ flexShrink: 0, cursor: disableOnClickHandler ? "default" : "pointer" }}
      onClick={disableOnClickHandler ? undefined : createOnClickHandler({ cell, expandOrCollapse })}
    />
  );
};

export default ExpandOrCollapseIcon;
