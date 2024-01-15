import type { Galaxy } from "../types/types";
import { createImportProperties, exportProperties } from "./conversion";
import propertyPanelDefinition from "./property-panel";

export default function ext(env: Galaxy): Record<string, unknown> {
  return {
    support: {
      // TODO Most of the code is in place to enable snapshot, however WYSIWYG is not always true. Depending on the scroll position, some cell that where visible when the screenshot was taken, is not fully visiable in the screenshot.
      // This should be fixed, possibly be figuring out how much of a cell is in view and then in the snapshot scroll that cell into view by the same amount.
      cssScaling: false,
      snapshot: env.flags.isEnabled("CLIENT_IM4976_PIVOT_DOWNLOAD"),
      export: false,
      sharing: false,
      exportData: true,
      viewData: true,
    },
    usePropertyHandler: "pivot-data",
    definition: propertyPanelDefinition(env),
    importProperties: createImportProperties(env),
    exportProperties,
  };
}
