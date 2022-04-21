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
        max: 1000,
        description(_: unknown, __: unknown, config: Config): string {
          const translationProperty =
            config && config.type === 'rows' ? 'Visualizations.Descriptions.Row' : 'Visualizations.Descriptions.Column';
          return translationProperty; // TODO translate
        },
      },
      measures: {
        min: 1,
        max: 1000,
        description(): string {
          return 'Visualizations.Descriptions.Values'; // TODO translate
        },
      },
    },
  ],
};
