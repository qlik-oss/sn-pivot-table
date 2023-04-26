import { stardust } from "@nebula.js/stardust";
import { Component } from "../../types/QIX";
import { LayoutService } from "../../types/types";

const BASE_PATH = "object.pivotTable";

export const DEFAULT_FONT_SIZE = "12px";
export const DEFAULT_FONT_FAMILY = '"Source Sans Pro", "Arial", "sans-serif"';
export const DEFAULT_FONT_COLOR = "#595959";
export const DEFAULT_BACKGROUND_COLOR = "transparent";
export const DEFAULT_ROW_HEIGHT = 28;
export const DEFAULT_LINE_CLAMP = 1;

interface StyleProperties {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
}

export interface Styling {
  header: StyleProperties;
  content: StyleProperties;
  backgroundColor: string;
  cellHeight: number;
  lineClamp: number;
}

enum Path {
  HEADER = "header",
  CONTENT = "content",
  BASE = "",
}
enum ComponentAttribute {
  FONT_SIZE = "fontSize",
  FONT_FAMILY = "fontFamily",
  COLOR = "color",
}

enum BaseAttribute {
  CELL_HEIGHT = "cellHeight",
  LINE_CLAMP = "lineClamp",
}

type ComponentPath = Path.HEADER | Path.CONTENT;

const THEME_ATTRIBUTES = [
  { path: Path.HEADER, attribute: ComponentAttribute.FONT_SIZE, defaultValue: DEFAULT_FONT_SIZE },
  { path: Path.HEADER, attribute: ComponentAttribute.FONT_FAMILY, defaultValue: DEFAULT_FONT_FAMILY },
  { path: Path.HEADER, attribute: ComponentAttribute.COLOR, defaultValue: DEFAULT_FONT_COLOR },
  { path: Path.CONTENT, attribute: ComponentAttribute.FONT_SIZE, defaultValue: DEFAULT_FONT_SIZE },
  { path: Path.CONTENT, attribute: ComponentAttribute.FONT_FAMILY, defaultValue: DEFAULT_FONT_FAMILY },
  { path: Path.CONTENT, attribute: ComponentAttribute.COLOR, defaultValue: DEFAULT_FONT_COLOR },
  // { path: Path.BASE, attribute: Attribute.BG_COLOR, defaultValue: DEFAULT_BACKGROUND_COLOR },
  { path: Path.BASE, attribute: BaseAttribute.CELL_HEIGHT, defaultValue: DEFAULT_LINE_CLAMP },
];

const getLayoutValue = (chartStyling: Component | undefined, path: ComponentPath, attribute: ComponentAttribute) => {
  switch (attribute) {
    case ComponentAttribute.COLOR:
      return chartStyling?.[path]?.fontColor?.color ?? undefined; // TODO: resolve color
    case ComponentAttribute.FONT_SIZE:
      const fontSize = chartStyling?.[path]?.fontSize;
      return fontSize ? `${fontSize}px` : undefined;
    case ComponentAttribute.FONT_FAMILY:
      return chartStyling?.[path]?.fontFamily;
    default:
      break;
  }
};

export const createStyling = (layoutService: LayoutService, theme: stardust.Theme): Styling => {
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");
  const styling: Styling = {
    header: {},
    content: {},
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    cellHeight: DEFAULT_ROW_HEIGHT,
    lineClamp: DEFAULT_LINE_CLAMP,
  };

  THEME_ATTRIBUTES.forEach((themeAttribute) => {
    const { path, attribute, defaultValue } = themeAttribute;
    const fallbackValue = theme.getStyle(BASE_PATH, path, attribute) ?? defaultValue;

    if (path === Path.BASE) {
      const lineClamp = chartStyling?.rowHeight?.linesCount ?? (fallbackValue as number);
      styling[BaseAttribute.LINE_CLAMP] = lineClamp;
      styling[BaseAttribute.CELL_HEIGHT] = lineClamp * DEFAULT_ROW_HEIGHT;
    } else {
      const attr = attribute as ComponentAttribute;
      styling[path][attr] = getLayoutValue(chartStyling, path, attr) ?? (fallbackValue as string);
    }
  });

  return styling;
};
