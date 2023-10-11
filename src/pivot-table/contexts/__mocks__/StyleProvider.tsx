import React from "react";
import type { StyleService } from "../../../types/types";

export const useStyleContext = (): StyleService => ({
  header: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    color: "#404040",
    background: "transparent",
    activeBackground: "rgba(0, 0, 0, 0.05)",
    hoverBackground: "rgba(0, 0, 0, 0.03)",
  },
  dimensionValue: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    color: "#404040",
    background: "transparent",
  },
  measureValue: {
    fontSize: "12px",
    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
    fontWeight: "600",
    fontStyle: "normal",
    textDecoration: "none",
    color: "contentColor",
    background: "contentBackground",
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
    lineClamp: 1,
    border: "rgba(0, 0, 0, 0.15)",
    divider: "rgba(0, 0, 0, 0.6)",
    background: "transparent",
  },
  headerCellHeight: 24,
  contentCellHeight: 24,
});

const StyleProvider = (): JSX.Element => <div />;

export default StyleProvider;
