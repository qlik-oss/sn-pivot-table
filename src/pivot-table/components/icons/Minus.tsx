import MinusOutlineIcon from "@qlik-trial/sprout/icons/react/MinusOutline";
import React from "react";

interface IconProps {
  onClick: ((e: React.SyntheticEvent<Element, Event>) => void) | undefined;
  color: string;
  testid: string;
  opacity: number;
}

const MinusIcon = ({ color, opacity, testid, onClick }: IconProps): JSX.Element => (
  <MinusOutlineIcon opacity={opacity} color={color} data-testid={testid} onClick={onClick} height="13px" />
);

export default MinusIcon;
