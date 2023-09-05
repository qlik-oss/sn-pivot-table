import ext from "./ext";
import useRender from "./hooks/use-render";
import createDataDefinition from "./qae/data-definition";
import initialProperties from "./qae/initial-properties";
import type { Galaxy } from "./types/types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova(env: Galaxy) {
  return {
    qae: {
      properties: {
        initial: initialProperties,
      },
      data: createDataDefinition(env),
    },
    ext: ext(env),
    component() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRender();
    },
  };
}
