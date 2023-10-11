import type { stardust } from "@nebula.js/stardust";
import getDimensionSection from "./dimension-value";
import gridSection from "./grid";
import headerSection from "./header";
import measureLabelsSection from "./measure-label";
import measureValueSection from "./measure-value";
import nullValuesSection from "./null-values";
import totalValuesSection from "./total-values";

const getStylingPanelConfig = (translator: stardust.Translator) => ({
  type: "items",
  items: [
    {
      component: "styling-panel",
      chartTitle: "Object.PivotTable",
      subtitle: "LayerStyleEditor.component.styling",
      translation: "LayerStyleEditor.component.styling",
      ref: "components",
      useGeneral: true,
      defaultValue: [],
      items: {
        headerSection: headerSection(translator),
        dimensionValueSection: getDimensionSection(translator),
        measureValueSection: measureValueSection(translator),
        measureLabelSection: measureLabelsSection(),
        totalValuesSection: totalValuesSection(),
        nullValuesSection: nullValuesSection(),
        gridSection,
      },
    },
  ],
});

export default getStylingPanelConfig;
