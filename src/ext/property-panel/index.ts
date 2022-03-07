import { stardust } from '@nebula.js/stardust';
import data from './data';
import addons from './addons';
import sorting from './sorting';
import settings from './settings';

interface PropertyPanelDefinition {
  type: 'items';
  component: 'accordion';
  items: Record<string, Record<string, unknown>>;
}

export default function create(env: stardust.Galaxy): PropertyPanelDefinition {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      data,
      sorting: sorting(env),
      addons,
      settings: settings(env),
    }
  };
};
