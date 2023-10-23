import React, { type ReactNode } from "react";
import { CELL_PADDING, stickyCell } from "../../shared-styles";

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
      ...stickyCell, // TODO can be hard-coded here?
      alignSelf: isLeftColumn ? "flex-start" : "center",
      ...(!isLeftColumn && { right: CELL_PADDING }),
    }}
  >
    {children}
  </div>
);

export default StickyCellContainer;
