import propertyPanelDefinition from './property-panel';

export default function ext(): Record<string, unknown> {
  return {
    support: {
      snapshot: false,
      export: true,
      sharing: false,
      exportData: true,
      viewData: true,
    },
    usePropertyHandler: 'pivot-data',
    definition: propertyPanelDefinition(),
  };
}
