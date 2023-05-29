import type { stardust } from "@nebula.js/stardust";
import contentSection from "./content";
import getDimensionSection from "./dimension-content";
import gridSection from "./grid";
import headerSection from "./header";

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
        contentSection: contentSection(translator),
        rowContentSection: getDimensionSection("rowContent", translator),
        columnContentSection: getDimensionSection("columnContent", translator),
        gridSection,
      },
    },
  ],
});

export default getStylingPanelConfig;