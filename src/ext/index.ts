import propertyPanelDefinition from './property-panel';
import { importProperties, exportProperties } from './conversion';
import { Galaxy } from '../types/types';

export default function ext(env: Galaxy): Record<string, unknown> {
  return {
    support: {
      snapshot: false,
      export: true,
      sharing: false,
      exportData: true,
      viewData: true,
    },
    usePropertyHandler: 'pivot-data',
    definition: propertyPanelDefinition(env),
    importProperties,
    exportProperties,
  };
}
