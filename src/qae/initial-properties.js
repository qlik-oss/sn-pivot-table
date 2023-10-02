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
    /** @type {DimensionProperties[]} */
    qDimensions: [],
    /** @type {MeasureProperties[]} */
    qMeasures: [],
    qMode: "P",
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
  title: "",
  /**
   * Visualization subtitle
   * @type {(string|StringExpression)=}
   */
  subtitle: "",
  /**
   * Visualization footnote
   * @type {(string|StringExpression)=}
   */
  footnote: "",
  /**
   * Null value properties
   * @type {object=}
   */
  nullValueRepresentation: {
    /**
     * Null value text
     * @type {string=}
     */
    text: "-",
  },
  /**
   * Holds general styling
   * @type {?Component[]}
   */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`
 * @typedef {object} DimensionProperties
 * @extends NxDimension
 * @property {InlineDimensionDef} qDef
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`
 * @typedef {object} MeasureProperties
 * @extends NxMeasure
 * @property {InlineMeasureDef} qDef
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @typedef {object} InlineDimensionDef
 * @extends NxInlineDimensionDef
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
 * @typedef {object} InlineMeasureDef
 * @extends NxInlineMeasureDef
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Column width info
 * @typedef {object} ColumnWidth
 * @property {('auto' | 'FitToContent' | 'pixels' | 'percentage')} type - Defines how the column width is set. `auto` calculates the width(s) so the total table width equals the chart width (for left side columns, auto will behave the same as fitToContent). `fitToContent` calculates a width based on the cells' content. `pixels` uses a specified pixel value. `percentage` sets the column width to specified percentage of the chart width
 * @property {number=} pixels - Is used (and mandatory) if type is `pixels`
 * @property {number=} percentage - Is used (and mandatory) if type is `percentage`
 */

/**
 * General styling for all columns.
 * Split up into header and content (body) styling.
 * If any property is not set, default values specific for each property is used.
 * @typedef {object} Component
 * @property {string} key - This should be set to `theme`
 * @property {ContentStyling=} content
 * @property {HeaderStyling=} header
 */

/**
 * Holds properties for font size, font color and hover styling.
 * @typedef {object} ContentStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 * @property {boolean=} hoverEffect - Toggles hover effect
 * @property {PaletteColor=} hoverColor - Background hover color. Uses `#f4f4f4` if no hover colors are set, is transparent if only `hoverFontColor` is set
 * @property {PaletteColor=} hoverFontColor - When only `hoverColor` is set, this is adjusted to either `#f4f4f4` or `#ffffff` for optimal contrast
 * @property {string=} padding - Css setting for the cell padding, defaults to `4px 12px`
 */

/**
 * Holds properties for font size and color.
 * @typedef {object} HeaderStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 */

/**
 * Color information structure. Holds the actual color and index in palette
 * @typedef {object} PaletteColor
 * @property {string} color - Color as hex string (mandatory if index: -1)
 * @property {number} index - Index in palette
 */

export default properties;
