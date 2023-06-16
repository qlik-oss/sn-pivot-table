import React from "react";

import { useStyleContext } from "../../contexts/StyleProvider";
import { borderStyle, cellStyle } from "../shared-styles";

interface Props {
  style: React.CSSProperties;
}

export const testId = "empty-header-cell";

const EmptyHeaderCell = ({ style }: Props): JSX.Element => {
  const styleService = useStyleContext();
  return (
    <div
      data-testid={testId}
      style={{
        ...cellStyle,
        ...borderStyle,
        ...style,
        borderColor: styleService.grid.border,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 1,
        borderTopWidth: 0,
      }}
    />
  );
};

export default EmptyHeaderCell;
