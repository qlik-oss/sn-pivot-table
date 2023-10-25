import MinusOutlineIcon from "@qlik-trial/sprout/icons/react/MinusOutline";
import React from "react";
import { PLUS_MINUS_ICON_SIZE } from "../../constants";

interface IconProps {
  onClick: ((e: React.SyntheticEvent<Element, Event>) => void) | undefined;
  color: string;
  opacity: number;
}

export const testIdCollapseIcon = "collapse-icon";

const MinusIcon = ({ color, opacity, onClick }: IconProps): JSX.Element => (
  <MinusOutlineIcon
    opacity={opacity}
    color={color}
    data-testid={testIdCollapseIcon}
    onClick={onClick}
    height={PLUS_MINUS_ICON_SIZE}
    style={{ flexShrink: 0 }}
  />
);

export default MinusIcon;
