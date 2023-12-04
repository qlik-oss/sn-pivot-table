import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import gridSection from "./grid";
import largePanelSection from "./large-panal-section";
import smallPanelSection from "./small-panel-section";

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
      useBackground: true,
      defaultValue: [],
      items: {
        headerSection: largePanelSection({ section: "header", defaultFontStyle: ["bold"], translator }),
        dimensionValueSection: largePanelSection({
          section: "dimensionValues",
          translator,
        }),
        measureValueSection: largePanelSection({
          section: "measureValues",
          translator,
        }),
        measureLabelSection: smallPanelSection({ section: "measureLabels" }),
        totalValuesSection: smallPanelSection({ section: "totalValues", defaultFontStyle: ["bold"] }),
        nullValuesSection: smallPanelSection({ section: "nullValues", fallbackBackground: Colors.NullValueBackground }),
        gridSection,
      },
    },
  ],
});

export default getStylingPanelConfig;
