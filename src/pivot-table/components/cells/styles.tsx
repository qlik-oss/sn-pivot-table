import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";
import type { CellStyling } from "../../../types/types";
import { HEADER_ICON_SIZE } from "../../constants";
import { DOUBLE_CELL_PADDING, baseFlex, textStyle } from "../shared-styles";

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
  gap: DOUBLE_CELL_PADDING,
  alignItems: "center",
  cursor: interactions.active ? "pointer" : "default",
  background,
  "&&:hover": {
    background: interactions.active && isDimension ? hoverBackground : background,
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
  gap: DOUBLE_CELL_PADDING,
}));

export const StyledLockIcon = styled("div")(() => ({
  ...baseFlex,
}));

export const StyledLabel = styled("div", {
  shouldForwardProp: (prop: string) =>
    !["fontSize", "fontFamily", "fontWeight", "fontStyle", "textDecoration", "justifyContent"].includes(prop),
})(
  ({
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textDecoration,
    justifyContent,
  }: Omit<CellStyling, "color" | "background"> & { justifyContent: string | undefined }) => ({
    ...textStyle,
    display: "flex",
    justifyContent,
    alignSelf: "center",
    flexGrow: 1,
    fontWeight,
    fontSize,
    fontFamily,
    fontStyle,
    textDecoration,
  }),
);
