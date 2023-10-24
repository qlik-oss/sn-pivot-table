import React, { type ReactNode } from "react";
import { CELL_PADDING } from "../../shared-styles";

type Props = {
  isLeftColumn: boolean;
  children: ReactNode;
};

const StickyCellContainer = ({ children, isLeftColumn }: Props): JSX.Element => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: `${CELL_PADDING}px`,
      width: "fit-content",
      maxWidth: "100%",
      position: "sticky",
      left: CELL_PADDING,
      top: CELL_PADDING,
      alignSelf: isLeftColumn ? "flex-start" : "center",
      ...(!isLeftColumn && { right: CELL_PADDING }),
    }}
  >
    {children}
  </div>
);

export default StickyCellContainer;
