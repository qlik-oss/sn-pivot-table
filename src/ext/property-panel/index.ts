import data from './data';
import addons from './addons';
import sorting from './sorting';
import settings from './settings';

interface PropertyPanelDefinition {
  type: 'items';
  component: 'accordion';
  items: Record<string, Record<string, unknown>>;
}

export default function create(): PropertyPanelDefinition {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      data,
      sorting,
      addons,
      settings,
    }
  };
};
