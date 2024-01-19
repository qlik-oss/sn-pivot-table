/* eslint-disable no-param-reassign */

import type { Galaxy } from "../types/types";

interface Config {
  type: "rows" | "columns";
}

export default function createDataDefinition(env: Galaxy) {
  const { translator } = env;

  return {
    targets: [
      {
        path: "/qHyperCubeDef",
        dimensions: {
          min: 1,
          max: 1000,
          description(_: unknown, __: unknown, config: Config): string {
            const translationProperty =
              config && config.type === "rows"
                ? "Visualizations.Descriptions.Row"
                : "Visualizations.Descriptions.Column";
            return translator.get(translationProperty);
          },
        },
        measures: {
          min: 1,
          max: 1000,
          description(): string {
            return translator.get("Visualizations.Descriptions.Values");
          },
        },
      },
    ],
  };
}
