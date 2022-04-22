import createData from './data';
import addons from './addons';
import sorting from './sorting';
import settings from './settings';
import { Galaxy } from '../../types/types';

interface PropertyPanelDefinition {
  type: 'items';
  component: 'accordion';
  items: Record<string, Record<string, unknown>>;
}

export default function create(env: Galaxy): PropertyPanelDefinition {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      data: createData(env),
      sorting,
      addons,
      settings,
    }
  };
};
