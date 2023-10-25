import PlusOutlineIcon from "@qlik-trial/sprout/icons/react/PlusOutline";
import React from "react";
import { PLUS_MINUS_ICON_SIZE } from "../../constants";

interface IconProps {
  onClick: ((e: React.SyntheticEvent<Element, Event>) => void) | undefined;
  color: string;
  opacity: number;
}

export const testIdExpandIcon = "expand-icon";

const PlusIcon = ({ color, opacity, onClick }: IconProps): JSX.Element => (
  <PlusOutlineIcon
    opacity={opacity}
    color={color}
    data-testid={testIdExpandIcon}
    onClick={onClick}
    height={PLUS_MINUS_ICON_SIZE}
    style={{ flexShrink: 0 }}
  />
);

export default PlusIcon;
