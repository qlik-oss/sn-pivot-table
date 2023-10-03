import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";
import { HEADER_ICON_SIZE } from "../../constants";
import { CELL_PADDING, textStyle } from "../shared-styles";

const baseFlex: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

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

interface StyledLabelProps {
  fontSize: string;
  fontFamily: string;
}

export const StyledLabel = styled("div", {
  shouldForwardProp: (prop: string) => !["fontSize", "fontFamily"].includes(prop),
})(({ fontSize, fontFamily }: StyledLabelProps) => ({
  ...textStyle,
  fontWeight: "600",
  alignSelf: "center",
  flexGrow: 1,
  fontSize,
  fontFamily,
}));
