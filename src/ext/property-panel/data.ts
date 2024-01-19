import { ColumnWidthType, ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import { CLIENT_IM_5851_MEASURE_FORMATTING } from "../../constants/flags";
import { type DimensionOrMeasureDef } from "../../types/QIX";
import { AttrExprInfoIDs, type Galaxy } from "../../types/types";

export interface Args {
  properties: EngineAPI.IGenericHyperCubeProperties;
}

const TOTAL_MODE_OFF = "TOTAL_OFF";
const TOTAL_MODE_EXPR = "TOTAL_EXPR";

const cellColoring = {
  component: "attribute-expression-reference",
  defaultValue: [],
  ref: "qAttributeExpressions",
  items: [
    {
      component: "expression",
      ref: "qExpression",
      expressionType: "measure",
      translation: "Object.Table.Measure.BackgroundExpression",
      defaultValue: "",
      id: AttrExprInfoIDs.CellBackgroundColor,
    },
    {
      component: "expression",
      ref: "qExpression",
      expressionType: "measure",
      translation: "Object.Table.Measure.ForegroundExpression",
      defaultValue: "",
      id: AttrExprInfoIDs.CellForegroundColor,
    },
  ],
};

function isTotalsVisible(itemData: EngineAPI.IHyperCubeDimensionDef, _: unknown, args: Args): boolean {
  // always visible if qIndentMode is not enabled
  if (!args.properties.qHyperCubeDef.qIndentMode) {
    return true;
  }

  // should be visible for first dimension in left tree.
  // should not be visible for remaining dimensions in left tree.
  const pseudoIdx = args.properties.qHyperCubeDef.qInterColumnSortOrder.indexOf(-1);

  let noOfLeftDims = args.properties.qHyperCubeDef.qNoOfLeftDims;

  if (pseudoIdx > -1 && pseudoIdx < noOfLeftDims) {
    noOfLeftDims -= 1;
  }
  const idx = args.properties.qHyperCubeDef.qDimensions.indexOf(itemData);
  return idx === 0 || idx >= noOfLeftDims;
}

// TODO: scope this out to common repo, don't see any differences in properties of default values atm
const columnResize = {
  type: {
    type: "string",
    component: "dropdown",
    ref: "qDef.columnWidth.type",
    translation: "Object.Table.Column.Width",
    options: [
      {
        value: ColumnWidthType.Auto,
        translation: "Common.Auto",
      },
      {
        value: ColumnWidthType.FitToContent,
        translation: "Object.Table.Column.FitToContent",
      },
      {
        value: ColumnWidthType.Pixels,
        translation: "Object.Table.Column.Pixels",
      },
      {
        value: ColumnWidthType.Percentage,
        translation: "Object.Table.Column.Percentage",
      },
    ],
    defaultValue: ColumnWidthType.Auto,
  },
  sizePixels: {
    ref: "qDef.columnWidth.pixels",
    translation: "Object.Table.Column.Pixels",
    type: "number",
    expression: "optional",
    defaultValue: ColumnWidthValues.PixelsDefault,
    show: (data: DimensionOrMeasureDef) => data.qDef.columnWidth?.type === ColumnWidthType.Pixels,
    change(data: DimensionOrMeasureDef) {
      if (data.qDef.columnWidth.pixels !== undefined) {
        // eslint-disable-next-line no-param-reassign
        data.qDef.columnWidth.pixels = Math.max(
          ColumnWidthValues.PixelsMin,
          Math.min(ColumnWidthValues.PixelsMax, data.qDef.columnWidth.pixels),
        );
      }
    },
  },
  sizePercentage: {
    ref: "qDef.columnWidth.percentage",
    translation: "Object.Table.Column.Percentage",
    type: "number",
    expression: "optional",
    defaultValue: ColumnWidthValues.PercentageDefault,
    show: (data: DimensionOrMeasureDef) => data.qDef.columnWidth?.type === ColumnWidthType.Percentage,
    change: (data: DimensionOrMeasureDef) => {
      if (data.qDef.columnWidth.percentage !== undefined) {
        // eslint-disable-next-line no-param-reassign
        data.qDef.columnWidth.percentage = Math.max(
          ColumnWidthValues.PercentageMin,
          Math.min(ColumnWidthValues.PercentageMax, data.qDef.columnWidth.percentage),
        );
      }
    },
  },
};

const createTextAlignItems = ({ key, translation }: { key: "textAlign" | "labelTextAlign"; translation: string }) => ({
  [`${key}Auto`]: {
    ref: `qDef.${key}.auto`,
    type: "boolean",
    component: "switch",
    translation,
    options: [
      {
        value: true,
        translation: "Common.Auto",
      },
      {
        value: false,
        translation: "Common.Custom",
      },
    ],
    defaultValue: true,
  },
  [key]: {
    ref: `qDef.${key}.align`,
    type: "string",
    component: "item-selection-list",
    horizontal: true,
    items: [
      {
        component: "icon-item",
        icon: "align_left",
        labelPlacement: "bottom",
        value: "left",
        translation: "properties.dock.left",
      },
      {
        component: "icon-item",
        icon: "align_center",
        labelPlacement: "bottom",
        value: "center",
        translation: "Common.Center",
      },
      {
        component: "icon-item",
        icon: "align_right",
        labelPlacement: "bottom",
        value: "right",
        translation: "properties.dock.right",
      },
    ],
    defaultValue: "left",
    show: (data: DimensionOrMeasureDef) => data.qDef[key] !== undefined && !data.qDef[key]?.auto,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createData = (env: Galaxy): Record<string, any> => {
  const { translator, anything, flags } = env;

  const data = {
    type: "items",
    component: "pivot-data",
    translation: "properties.data",
    addTranslation: "Properties.AddData",
    items: {
      dimensions: {
        type: "array",
        component: "dimensions",
        translation: "Common.Dimensions",
        alternativeTranslation: "properties.alternative.dimensions",
        ref: "qHyperCubeDef.qDimensions",
        disabledRef: "qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions",
        min: 1,
        allowAdd: true,
        allowRemove: true,
        allowMove: true,
        addTranslation: "properties.dimensions.add",
        grouped: true,
        items: {
          libraryId: {
            type: "string",
            component: "library-item",
            libraryItemType: "dimension",
            ref: "qLibraryId",
            translation: "Common.Dimension",
            show: (itemData: EngineAPI.IHyperCubeDimensionDef): boolean => !!itemData.qLibraryId,
          },
          inlineDimension: {
            component: "inline-dimension",
            show: (itemData: EngineAPI.IHyperCubeDimensionDef): boolean => !itemData.qLibraryId,
          },
          autoSort: {
            ref: "qDef.autoSort",
            type: "boolean",
            defaultValue: true,
            show: false,
          },
          cId: {
            ref: "qDef.cId",
            type: "string",
            show: false,
          },
          nullSuppression: {
            type: "boolean",
            ref: "qNullSuppression",
            defaultValue: false,
            translation: "properties.dimensions.showNull",
            inverted: true,
          },
          totalMode: {
            type: "string",
            component: "switch",
            translation: "properties.showTotals",
            ref: "qOtherTotalSpec.qTotalMode",
            defaultValue: TOTAL_MODE_OFF,
            trueOption: {
              value: TOTAL_MODE_EXPR,
              translation: "properties.on",
            },
            falseOption: {
              value: TOTAL_MODE_OFF,
              translation: "properties.off",
            },
            show: anything.sense?.isUnsupportedFeature?.("totals") ? false : isTotalsVisible,
          },
          totalsLabel: {
            type: "string",
            component: "expression",
            expressionType: "StringExpr",
            ref: "qTotalLabel",
            translation: "properties.totals.label",
            defaultValue: () => translator.get("Object.Table.Totals"),
            show(itemData: EngineAPI.IHyperCubeDimensionDef, _: unknown, args: Args): boolean {
              return (
                !anything.sense?.isUnsupportedFeature?.("totals") &&
                itemData.qOtherTotalSpec?.qTotalMode !== TOTAL_MODE_OFF &&
                isTotalsVisible(itemData, _, args)
              );
            },
          },
          visibilityCondition: {
            type: "string",
            component: "expression",
            ref: "qCalcCondition.qCond",
            expression: "optional",
            expressionType: "ValueExpr",
            translation: "Object.Table.Columns.VisibilityCondition",
            defaultValue: { qv: "" },
            isExpression(val: string | undefined): boolean {
              return typeof val === "string" && val.trim().length > 0;
            },
          },
          cellColoring,
          ...createTextAlignItems({
            key: "labelTextAlign",
            translation: "Common.Text.LabelTextAlignment",
          }),
          ...createTextAlignItems({
            key: "textAlign",
            translation: "Common.Text.TextAlignment",
          }),
          ...columnResize,
          dimensionLimits: {
            uses: "dimensions.items.dimensionLimits",
          },
          globalGrouping: {
            type: "boolean",
            translation: "properties.dimensionLimits.globalGrouping",
            ref: "qOtherTotalSpec.qGlobalOtherGrouping",
            defaultValue: false,
            show(itemData: EngineAPI.IHyperCubeDimensionDef) {
              return itemData?.qOtherTotalSpec?.qOtherMode !== "OTHER_OFF";
            },
          },
        },
      },
      measures: {
        type: "array",
        component: "measures",
        translation: "Common.Measures",
        ref: "qHyperCubeDef.qMeasures",
        disabledRef: "qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures",
        min: 1,
        allowAdd: true,
        allowRemove: true,
        allowMove: true,
        addTranslation: "properties.measures.add",
        grouped: true,
        items: {
          libraryId: {
            type: "string",
            component: "library-item",
            libraryItemType: "measure",
            ref: "qLibraryId",
            translation: "Common.Measure",
            show: (itemData: EngineAPI.IHyperCubeMeasureDef): boolean => !!itemData.qLibraryId,
          },
          inlineMeasure: {
            component: "inline-measure",
            show: (itemData: EngineAPI.IHyperCubeMeasureDef): boolean => !itemData.qLibraryId,
          },
          autoSort: {
            ref: "qDef.autoSort",
            type: "boolean",
            defaultValue: true,
            show: false,
          },
          cId: {
            ref: "qDef.cId",
            type: "string",
            show: false,
          },
          numberFormatting: flags.isEnabled(CLIENT_IM_5851_MEASURE_FORMATTING)
            ? {
                uses: "measures.items.numberFormatting",
              }
            : undefined,
          visibilityCondition: {
            type: "string",
            component: "expression",
            ref: "qCalcCondition.qCond",
            expression: "optional",
            expressionType: "ValueExpr",
            translation: "Object.Table.Columns.VisibilityCondition",
            defaultValue: { qv: "" },
            isExpression(val: string | undefined): boolean {
              return typeof val === "string" && val.trim().length > 0;
            },
          },
          cellColoring,
          ...createTextAlignItems({
            key: "labelTextAlign",
            translation: "Common.Text.LabelTextAlignment",
          }),
          ...createTextAlignItems({
            key: "textAlign",
            translation: "Common.Text.TextAlignment",
          }),
          ...columnResize,
        },
      },
    },
  };

  return data;
};

export default createData;
