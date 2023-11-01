import React, { type ReactNode } from "react";
import { CELL_PADDING } from "../../shared-styles";

type Props = {
  isLeftColumn: boolean;
  children: ReactNode;
};

const StickyCellContainer = ({ children, isLeftColumn }: Props): JSX.Element => {
  const align = isLeftColumn ? "flex-start" : "center";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: align,
        gap: `${CELL_PADDING}px`,
        width: "fit-content",
        maxWidth: "100%",
        position: "sticky",
        left: CELL_PADDING,
        top: 0,
        right: isLeftColumn ? undefined : CELL_PADDING,
        alignSelf: align,
      }}
    >
      {children}
    </div>
  );
};

export default StickyCellContainer;
