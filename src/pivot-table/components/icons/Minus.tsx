/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

interface IconProps {
  onClick: ((e: React.SyntheticEvent<Element, Event>) => void) | undefined;
  color: string | undefined;
  testid: string;
  opacity: number;
}

const MinusIcon = ({ color, opacity, testid, onClick }: IconProps): JSX.Element => (
  <svg
    fontSize="13px"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    data-testid={testid}
  >
    <path
      opacity={opacity}
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 15C11.8477 15 15 11.8477 15 8C15 4.15228 11.8477 1 8 1C4.15228 1 1 4.15228 1 8C1 11.8477 4.15228 15 8 15ZM8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16Z"
    />
    <path opacity={opacity} fill={color} fillRule="evenodd" clipRule="evenodd" d="M12 8.5H4V7.5H12V8.5Z" />
  </svg>
);

export default MinusIcon;
