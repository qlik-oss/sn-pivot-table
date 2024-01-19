import type { Direction } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { createV5ThemeOptions } from "@qlik-trial/sprout/theme";

export default function muiSetup(direction: Direction | undefined) {
  const sproutTheme = createV5ThemeOptions();
  if (sproutTheme?.components?.MuiTable?.styleOverrides) {
    sproutTheme.components.MuiTable.styleOverrides.root = {};
  }

  return createTheme({ ...sproutTheme, direction });
}
