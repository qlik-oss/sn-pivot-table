/**
 * @extends {GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   * @default
   */
   version: process.env.PACKAGE_VERSION,
  /**
   * @extends {HyperCubeDef}
   */
  qHyperCubeDef: {
    /** @type {boolean} */
    qAlwaysFullyExpanded: false,
    /** @type {NxDimension[]} */
    qDimensions: [],
    /** @type {NxMeasure[]} */
    qMeasures: [],
    qMode: 'P',
    /** @type {boolean} */
    qSuppressMissing: true,
    /** @type {boolean} */
    qSuppressZero: false,
    /** @type {boolean} */
    qShowTotalsAbove: true,
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qWidth: 50,
        qHeight: 50,
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
   * @type {(string|StringExpression)=}
   */
  title: '',
  /**
   * Visualization subtitle
   * @type {(string|StringExpression)=}
   */
  subtitle: '',
  /**
   * Visualization footnote
   * @type {(string|StringExpression)=}
   */
  footnote: '',
  /**
   * Null value properties
   * @type {object=}
   */
  nullValueRepresentation: {
    /**
     * Null value text
     * @type {string=}
     */
    text: '-'
  },
};

export default properties;
