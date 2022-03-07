/* eslint-disable no-param-reassign */

interface Config {
  type: 'rows'|'columns'
}

export default {
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 1,
        max: 15,
        description(_: unknown, __: unknown, config: Config): string {
          const translationProperty =
            config && config.type === 'rows' ? 'Visualizations.Descriptions.Row' : 'Visualizations.Descriptions.Column';
          return translationProperty; // TODO translate
        },
      },
      measures: {
        min: 0,
        max: 15,
        description(): string {
          return 'Visualizations.Descriptions.Values'; // TODO translate
        },
      },
      testing: {
        min: 0,
        max: 1,
      }
    },
  ],
};
