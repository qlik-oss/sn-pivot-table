import PlusOutlineIcon from "@qlik-trial/sprout/icons/react/PlusOutline";
import React from "react";
import { headerPlusMinusIconWrapperStyle } from "./styles";

interface IconProps {
  onClick: ((e: React.SyntheticEvent<Element, Event>) => void) | undefined;
  color: string;
  testid: string;
  opacity: number;
}

const PlusIcon = ({ color, opacity, testid, onClick }: IconProps): JSX.Element => (
  <div style={headerPlusMinusIconWrapperStyle}>
    <PlusOutlineIcon opacity={opacity} color={color} data-testid={testid} onClick={onClick} height="13px" />
  </div>
);

export default PlusIcon;
