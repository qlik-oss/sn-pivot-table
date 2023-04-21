import { stardust } from "@nebula.js/stardust";
import { DEFAULT_ROW_HEIGHT } from "../pivot-table/constants";
import { StyleService } from "../types/types";

export const DEFAULT_FONT_SIZE = "13px";
export const DEFAULT_FONT_FAMILY = '"Source Sans Pro", "Arial", "sans-serif"';
export const DEFAULT_TEXT_COLOR = "#595959";
export const DEFAULT_BACKGROUND_COLOR = "transparent";

const THEME_STYLES = [
  { basePath: "object.pivotTable", path: "header", attribute: "fontSize", defaultValue: DEFAULT_FONT_SIZE },
  { basePath: "object.pivotTable", path: "header", attribute: "fontFamily", defaultValue: DEFAULT_FONT_FAMILY },
  { basePath: "object.pivotTable", path: "header", attribute: "color", defaultValue: DEFAULT_TEXT_COLOR },
  { basePath: "object.pivotTable", path: "content", attribute: "fontSize", defaultValue: DEFAULT_FONT_SIZE },
  { basePath: "object.pivotTable", path: "content", attribute: "fontFamily", defaultValue: DEFAULT_FONT_FAMILY },
  { basePath: "object.pivotTable", path: "content", attribute: "color", defaultValue: DEFAULT_TEXT_COLOR },
  { basePath: "object.pivotTable", path: "", attribute: "backgroundColor", defaultValue: DEFAULT_BACKGROUND_COLOR },
];

const createStyleService = (theme: stardust.Theme): StyleService => {
  const styleService: StyleService = {
    header: {},
    content: {},
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    cellHeight: DEFAULT_ROW_HEIGHT,
    lineClamp: 1,
  };

  THEME_STYLES.forEach(({ basePath, path, attribute, defaultValue }) => {
    const resolvedValue = theme.getStyle(basePath, path, attribute) ?? defaultValue;

    switch (path) {
      case "header":
      case "content":
        styleService[path][attribute] = resolvedValue;
        break;
      case "":
        styleService[attribute as "backgroundColor"] = resolvedValue;
        break;
      default:
        break;
    }
  });

  return styleService;
};

export default createStyleService;
