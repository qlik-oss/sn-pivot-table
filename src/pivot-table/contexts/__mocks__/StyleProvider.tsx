import React from "react";

export const useStyleContext = () => ({
  header: {
    fontSize: "12px",
    fontFamily: '"Source Sans  Pro", "Arial", "sans-serif"',
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    background: "transparent",
    activeBackground: "rgba(0, 0, 0, 0.05)",
    hoverBackground: "rgba(0, 0, 0, 0.03)",
  },
  content: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "rgba(0, 0, 0, 0.55)",
    background: "transparent",
    lineClamp: 1,
  },
  rowContent: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "#404040",
    background: "transparent",
  },
  columnContent: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "#404040",
    background: "transparent",
  },
  measureLabel: {
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    color: "measureLabelColor",
    background: "measureLabelBackground",
  },
  totalValue: {
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    color: "#404040",
    background: "transparent",
  },
  nullValue: {
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    color: "nullColor",
    background: "nullBackground",
  },
  grid: {
    rowHeight: "compact",
    border: "rgba(0, 0, 0, 0.15)",
    divider: "rgba(0, 0, 0, 0.6)",
  },
  headerCellHeight: 24,
  contentCellHeight: 24,
});

const StyleProvider = (): JSX.Element => <div />;

export default StyleProvider;
