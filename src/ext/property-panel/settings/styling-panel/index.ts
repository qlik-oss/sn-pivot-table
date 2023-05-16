import { contentSection } from "./content";
import { getDimensionSection } from "./dimension-content";
import { gridSection } from "./grid";
import { headerSection } from "./header";

export const getStylingPanelConfig = () => ({
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
        headerSection,
        contentSection,
        rowContentSection: getDimensionSection("rowContent"),
        columnContentSection: getDimensionSection("columnContent"),
        gridSection,
      },
    },
  ],
});
