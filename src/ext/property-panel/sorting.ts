type Setter = (type: string, value: number) => void;

const SEARCH_SORTING_AUTO = 'auto';
const SEARCH_SORTING_INHERIT = 'inherit';

const sorting = {
  type: 'items',
  translation: 'properties.sorting',
  items: {
    sortbyY: {
      type: 'items',
      items: {
        sortbyYToggle: {
          ref: 'qHyperCubeDef.qSortbyYValue',
          type: 'boolean',
          component: 'switch',
          translation: 'properties.sorting.sortByY.label',
          convertFunctions: {
            get: (getter: (type: string) => boolean): boolean => !!getter('integer'),
            set: (value: boolean, setter: Setter): void => setter('integer', value ? -1 : 0),
          },
          options: [
            {
              value: true,
              translation: 'properties.on',
            },
            {
              value: false,
              translation: 'properties.off',
            },
          ],
        },
        sortbyYOrder: {
          ref: 'qHyperCubeDef.qSortbyYValue',
          type: 'string',
          component: 'dropdown',
          defaultValue: 0,
          options: [
            {
              value: 1,
              translation: 'properties.sorting.ascending',
            },
            {
              value: -1,
              translation: 'properties.sorting.descending',
            },
          ],
          show: (itemData: EngineAPI.IGenericHyperCubeProperties): boolean => !!itemData?.qHyperCubeDef?.qSortbyYValue,
        },
      },
    },
    defaultSorting: {
      uses: 'sorting',
      items: {
        dimensions: {
          showPriority: false,
          allowMove: false,
        },
        measures: {
          included: false,
        },
      },
    },
    searchSorting: {
      ref: 'search.sorting',
      type: 'string',
      component: 'dropdown',
      defaultValue: SEARCH_SORTING_AUTO,
      translation: 'Object.Table.SortingInSearch',
      options: [
        {
          value: SEARCH_SORTING_AUTO,
          translation: 'Common.Auto',
        },
        {
          value: SEARCH_SORTING_INHERIT,
          translation: 'Object.Table.SortingInSearch.InheritFromDimension',
        },
      ],
    },
  },
};

export default sorting;
