import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";

interface Props {
  interactions: stardust.Interactions;
  background: string;
  hoverBackground: string;
}

export const StyledHeaderCellWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== "interactions" && prop !== "hoverBackground" && prop !== "background",
})(({ interactions, background, hoverBackground }: Props) => ({
  padding: 0,
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 24px",
  gridGap: "4px",
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
