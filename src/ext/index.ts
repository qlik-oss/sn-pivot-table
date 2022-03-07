import { stardust } from '@nebula.js/stardust';
import propertyPanelDefinition from './property-panel';

export default function ext(env: stardust.Galaxy): Record<string, unknown> {
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
  };
}
