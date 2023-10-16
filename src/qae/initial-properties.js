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
   * General and chart specific styling
   * @type {(Component[])=}
   */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`
 * @name DimensionProperties
 * @type object
 * @extends NxDimension
 * @property {InlineDimensionDef} qDef
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`
 * @name MeasureProperties
 * @type object
 * @extends NxMeasure
 * @property {InlineMeasureDef} qDefs
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @name InlineDimensionDef
 * @type object
 * @extends NxInlineDimensionDef
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
 * @name InlineMeasureDef
 * @type object
 * @extends NxInlineMeasureDef
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Column width info. For the left grid, the properties are always applied.
 * For the right grid, only the leaf nodes will listen to the properties, and the columns above will get the width of the leaves accumulated
 * @name ColumnWidth
 * @type object
 * @property {('auto' | 'FitToContent' | 'pixels' | 'percentage')} type - Defines how the column width is set. For the right grid, `auto` calculates the width(s) so the total width of the columns equals the right grid width. If the width reaches a minimum value, the columns will overflow. For the left grid, `auto` is N/A and defaults to `fitToContent`. `fitToContent` calculates a width based on the column's content. `pixels` uses a specified pixel value. `percentage` sets the column width to specified percentage of the chart/grid width
 * @property {number=} pixels - Pixel value used if type is `pixels`
 * @property {number=} percentage - Percentage value used if type is `percentage`. Note that for the left grid columns, this is a percentage of the whole chart width. For the right grid columns, it is a percentage of the right grid width
 */

/**
 * Styling defintions
 * @name Component
 * @type {ChartStyling | GeneralStyling}
 */

/**
 * Mandatory key for general styling
 * @name GeneralStylingKey
 * @type {"general"}
 */

/**
 * Font styling values
 * @name FontStyleValues
 * @type {"bold" | "italic" | "underline"}
 */

/**
 * General chart styling
 * @name GeneralStyling
 * @type object
 * @property {GeneralStylingKey} key
 * @property {TitleStyling} title
 * @example
 * {
 *  key: "general",
 *  title: {
 *    main: {
 *      fontSize: "18px",
 *      fontFamily: "Arial",
 *      fontStyle: ["bold", "italic"],
 *      color: { color: "orangered" },
 *    }
 *  }
 * }
 */

/**
 * Title styling options
 * @name TitleOptions
 * @type object
 * @property {string} [fontSize] - Font size in pixel value
 * @property {string} [fontFamily] - Font family
 * @property {FontStyleValues[]} [fontStyle] - Font style
 * @property {PaletteColor} [color] - Font color palette
 */

/**
 * Title styling
 * @name TitleStyling
 * @type object
 * @property {TitleOptions} [main] - Styling for chart title
 * @property {TitleOptions} [subTitle] - Styling for chart sub title
 * @property {TitleOptions} [footer] - Styling for chart footer
 */

/**
 * Mandatory key for chart styling
 * @name ChartStylingKey
 * @type {"theme"}
 */

/**
 * Custom styling of cells
 * @name ChartStyling
 * @type object
 * @property {ChartStylingKey} key
 * @property {CellStyling} [header] - Styling for header cells
 * @property {CellStyling} [dimensionValues] - Styling for dimension value cells
 * @property {CellStyling} [measureValues] - Styling for measure value cells
 * @property {PartialCellStyling} [measureLabels] - Styling for measure label cells
 * @property {PartialCellStyling} [totalValues] - Styling for total value cells
 * @property {PartialCellStyling} [nullValues] - Styling for null values cells
 * @property {GridStyling} [grid] - General grid styling
 * @example
 * {
 *  key: "theme",
 *  dimensionValues: {
 *    fontSize: "18px",
 *    fontFamily: "Arial",
 *    fontStyle: ["bold", "italic"],
 *    fontColor: { color: "orangered" },
 *    background: { index: 2 }
 *  }
 * }
 */

/**
 * Properties for styling a cell
 * @name CellStyling
 * @type object
 * @property {string} [fontSize] - Font size in pixel value
 * @property {string} [fontFamily] - Font family
 * @property {FontStyleValues[]} [fontStyle] - Font style
 * @property {PaletteColor} [fontColor] - Font color palette
 * @property {PaletteColor} [background] - Cell background color palette
 */

/**
 * Properties for styling a cell
 * @name PartialCellStyling
 * @type object
 * @property {FontStyleValues[]} [fontStyle] - Font style
 * @property {PaletteColor} [fontColor] - Font color palette
 * @property {PaletteColor} [background] - Cell background color palette
 */

/**
 * General grid styling
 * @name GridStyling
 * @type object
 * @property {number} [lineClamp] - A numerical value that represents the number of lines a text at most can be splitt into
 * @property {PaletteColor} [border] - Border color between cells
 * @property {PaletteColor} [divider] - Border color between row and column dimensions sections
 * @property {PaletteColor} [background]
 */

/**
 * Color information structure. Holds the actual color and index in palette
 * @name PaletteColor
 * @type object
 * @property {string} color - Color as hex string (mandatory if index: -1)
 * @property {number} index - Index in palette
 */

export default properties;
