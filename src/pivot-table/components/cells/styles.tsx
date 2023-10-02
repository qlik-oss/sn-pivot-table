import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";
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
}

export const StyledHeaderCellWrapper = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !["interactions", "hoverBackground", "background", "shouldShowMenuIcon"].includes(prop),
})(({ interactions, background, hoverBackground, shouldShowMenuIcon }: StyledHeaderCellWrapperProps) => ({
  // inline styling uses getBorderStyle(..) which has a padding of 4px and it overrides this
  padding: "0 !important",
  position: "relative",
  display: "grid",
  gridTemplateColumns: shouldShowMenuIcon ? "1fr 24px" : "1fr",
  gridGap: shouldShowMenuIcon ? CELL_PADDING : 0,
  alignItems: "center",
  cursor: interactions.active ? "pointer" : "default",
  background,
  "&&:hover": {
    background: interactions.active ? hoverBackground : background,
  },
}));

export const StyledHeaderAnchor = styled(Box)({
  position: "absolute",
  left: 0,
  bottom: 0,
});

export const StyledHeaderCell = styled("div")(() => ({
  ...baseFlex,
  flexDirection: "row",
  overflow: "hidden",
  position: "relative",
}));

export const StyledLockIcon = styled("div")(() => ({
  ...baseFlex,
  marginLeft: CELL_PADDING,
}));

interface StyledLabelProps {
  shouldShowMenuIcon: boolean;
  fontSize: string;
  fontFamily: string;
}

export const StyledLabel = styled("div", {
  shouldForwardProp: (prop: string) => !["shouldShowMenuIcon", "fontSize", "fontFamily"].includes(prop),
})(({ shouldShowMenuIcon, fontSize, fontFamily }: StyledLabelProps) => ({
  ...textStyle,
  fontWeight: "600",
  alignSelf: "center",
  flexGrow: 1,
  paddingLeft: CELL_PADDING,
  paddingRight: shouldShowMenuIcon ? 0 : CELL_PADDING,
  fontSize,
  fontFamily,
}));
