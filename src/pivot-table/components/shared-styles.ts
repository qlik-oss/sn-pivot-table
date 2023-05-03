import type React from "react";
import { LINE_HEIGHT_COEFFICIENT } from "../constants";

const borderStyle: React.CSSProperties = {
  boxSizing: "border-box",
  padding: 4,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 0,
  borderTopWidth: 0,
  borderColor: "rgb(230, 230, 230)",
  borderStyle: "solid",
};

const textStyle: React.CSSProperties = {
  lineHeight: `calc(${LINE_HEIGHT_COEFFICIENT})`,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const gridBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderColor: "#a6a6a6",
  boxSizing: "border-box",
};

const getLineClampStyle = (clampCount: number): React.CSSProperties => ({
  whiteSpace: "unset",
  display: "-webkit-box",
  WebkitLineClamp: clampCount,
  WebkitBoxOrient: "vertical",
  lineBreak: "anywhere",
});

const stickyCell: React.CSSProperties = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: 4,
  top: 4,
};

export { borderStyle, textStyle, gridBorderStyle, stickyCell, getLineClampStyle };
