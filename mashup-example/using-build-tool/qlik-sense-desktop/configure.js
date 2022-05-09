import { embed } from '@nebula.js/stardust';
// import table from '@nebula.js/sn-pivot-table';
// To load local sn-pivot-table extension
import pivotTable from '../../../core/esm/index';
import customTheme from './theme/sense-dark-horizon';

const types = [
  {
    name: 'pivot-table',
    load: () => Promise.resolve(pivotTable),
  },
];

const themes = [
  {
    id: 'myTheme',
    load: () => Promise.resolve(customTheme),
  },
];

const nuked = embed.createConfiguration({
  types,
  themes,
  context: {
    theme: 'myTheme',
    language: 'en-US',
    constraints: {
      active: false, // turn off interactions that affect the state of the visual representation including selection, zoom, scroll, etc.
      select: true, // turn off selections.
      passive: false, // turn off interactions like tooltips.
    },
  },
});

export default nuked;
