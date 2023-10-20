import React, { type ReactNode } from "react";
import { CELL_PADDING, stickyCell } from "../../shared-styles";

type Props = {
  isLeftColumn: boolean;
  children: ReactNode;
};

const cellStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "4px",
};

const InnerContainer = ({ children, isLeftColumn }: Props): JSX.Element => (
  <div
    style={{
      ...cellStyle,
      ...stickyCell,
      alignSelf: isLeftColumn ? "flex-start" : "center",
      ...(!isLeftColumn && { right: CELL_PADDING }),
    }}
  >
    {children}
  </div>
);

export default InnerContainer;
