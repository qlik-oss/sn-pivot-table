import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";
import type { CellStyling } from "../../../types/types";
import { HEADER_ICON_SIZE } from "../../constants";
import { CELL_PADDING, baseFlex, textStyle } from "../shared-styles";

interface StyledHeaderCellWrapperProps {
  interactions: stardust.Interactions;
  background: string;
  hoverBackground: string;
  shouldShowMenuIcon: boolean;
  isDimension: boolean;
}

export const StyledHeaderCellWrapper = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !["interactions", "hoverBackground", "background", "shouldShowMenuIcon", "isDimension"].includes(prop),
})(({ interactions, background, hoverBackground, shouldShowMenuIcon, isDimension }: StyledHeaderCellWrapperProps) => ({
  pointerEvents: isDimension ? "all" : "none",
  position: "relative",
  display: "grid",
  gridTemplateColumns: shouldShowMenuIcon ? `1fr ${HEADER_ICON_SIZE}px` : "1fr",
  gap: CELL_PADDING,
  alignItems: "center",
  cursor: interactions.active ? "pointer" : "default",
  background,
  "&&:hover": {
    background: interactions.active ? hoverBackground : background,
  },
}));

export const StyledHeaderAnchor = styled("div")({
  position: "absolute",
  left: 0,
  bottom: 0,
});

export const StyledHeaderCell = styled("div")(() => ({
  ...baseFlex,
  flexDirection: "row",
  overflow: "hidden",
  position: "relative",
  gap: CELL_PADDING,
}));

export const StyledLockIcon = styled("div")(() => ({
  ...baseFlex,
}));

export const StyledLabel = styled("div", {
  shouldForwardProp: (prop: string) =>
    !["fontSize", "fontFamily", "fontWeight", "fontStyle", "textDecoration"].includes(prop),
})(({ fontSize, fontFamily, fontWeight, fontStyle, textDecoration }: Omit<CellStyling, "color" | "background">) => ({
  ...textStyle,
  alignSelf: "center",
  flexGrow: 1,
  fontWeight,
  fontSize,
  fontFamily,
  fontStyle,
  textDecoration,
}));

export const AdjusterHitArea = styled("div", {
  shouldForwardProp: (prop: string) => prop !== "isLastColumn",
})(({ isLastColumn = false }: { isLastColumn: boolean }) => ({
  display: "flex",
  position: "absolute",
  height: "100%",
  top: 0,
  cursor: "col-resize",
  // last column padding, other double padding + border
  width: `${isLastColumn ? 4 : 9}px`,
  justifyContent: isLastColumn ? "flex-end" : "center",
  "&&:hover:not(:focus, :active)": {
    "& .sn-pivot-table-column-adjuster-border": {
      background: "#D9D9D9",
    },
  },
  "&&:focus-visible, :active": {
    outline: "none",
    "& .sn-pivot-table-column-adjuster-border": {
      background: "#177fe6",
    },
  },
}));

export const AdjusterBorder = styled("div")({
  position: "absolute",
  height: "100%",
  width: "3px",
});
