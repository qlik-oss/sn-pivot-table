import { Galaxy } from "../../types/types";
import addons from "./addons";
import createData from "./data";
import settings from "./settings";
import sorting from "./sorting";

interface PropertyPanelDefinition {
  type: "items";
  component: "accordion";
  items: Record<string, Record<string, unknown>>;
}

export default function create(env: Galaxy): PropertyPanelDefinition {
  return {
    type: "items",
    component: "accordion",
    items: {
      data: createData(env),
      sorting,
      addons,
      settings,
    },
  };
}
