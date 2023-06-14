import React from "react";

export const useStyleContext = () => ({
  lineClamp: 1,
  header: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    background: "transparent",
    rowTitle: { color: "#404040", background: "transparent" },
    columnTitle: { color: "#404040", background: "transparent" },
  },
  content: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "rgba(0, 0, 0, 0.55)",
    background: "transparent",
    nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
    totalValue: { color: "#404040", background: "transparent" },
  },
  rowContent: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "#404040",
    background: "transparent",
    nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
    totalLabel: { color: "#404040", background: "transparent" },
    measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
  },
  columnContent: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    color: "#404040",
    background: "transparent",
    nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
    totalLabel: { color: "#404040", background: "transparent" },
    measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
  },
  grid: {
    rowHeight: "compact",
    lineCount: 1,
    border: "rgba(0, 0, 0, 0.15)",
    divider: "rgba(0, 0, 0, 0.6)",
  },
  headerCellHeight: 24,
  contentCellHeight: 24,
});

const StyleProvider = (): JSX.Element => <div />;

export default StyleProvider;
