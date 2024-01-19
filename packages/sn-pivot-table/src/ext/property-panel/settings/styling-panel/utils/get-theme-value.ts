import type { CurrentTheme } from "../../../../../types/QIX";
import type { LargeSection } from "../large-panal-section";
import type { SmallSection } from "../small-panel-section";

type ThemeColorAttribute = "color" | "backgroundColor";

type ThemeFontAttribute = "fontSize" | "fontFamily";

const getThemeValue = (
  currentTheme: CurrentTheme,
  section: SmallSection | LargeSection,
  attribute: ThemeFontAttribute | ThemeColorAttribute,
) => {
  switch (section) {
    case "header":
      return currentTheme?.object?.pivotTableV2?.dimension?.label?.name?.[attribute];
    case "dimensionValues":
      return currentTheme?.object?.pivotTableV2?.dimension?.label?.value?.[attribute];
    case "measureLabels":
      return currentTheme?.object?.pivotTableV2?.measure?.label?.name?.[attribute as ThemeColorAttribute];
    case "measureValues":
      return currentTheme?.object?.pivotTableV2?.measure?.label?.value?.[attribute];
    case "totalValues":
      return currentTheme?.object?.pivotTableV2?.total?.label?.value?.[attribute as ThemeColorAttribute];
    case "nullValues":
      return currentTheme?.object?.pivotTableV2?.null?.label?.value?.[attribute as ThemeColorAttribute];
    default:
      return undefined;
  }
};

export default getThemeValue;
