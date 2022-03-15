import { DEFAULT_PAGE_SIZE } from '../constants';

/**
 * @extends {qae.GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * @extends {qae.HyperCubeDef}
   */
  qHyperCubeDef: {
    /** @type {boolean} */
    qAlwaysFullyExpanded: false,
    /** @type {DimensionProperties[]} */
    qDimensions: [],
    /** @type {MeasureProperties[]} */
    qMeasures: [],
    qMode: 'P',
    /** @type {boolean} */
    qSuppressMissing: true,
    /** @type {boolean} */
    qSuppressZero: false,
    /** @type {boolean} */
    qShowTotalsAbove: false,
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qWidth: DEFAULT_PAGE_SIZE,
        qHeight: DEFAULT_PAGE_SIZE,
      },
    ],
    qIndentMode: false,
  },
  /**
   * Show title for the visualization
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * Visualization title
   * @type {string=}
   */
  title: '',
  /**
   * Visualization subtitle
   * @type {string=}
   */
  subtitle: '',
  /**
   * Holds general styling
   * @type {Styling[]}
   */
  footnote: '',
};

export default properties;
