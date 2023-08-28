import type { Component } from "../types/QIX";

declare module "initial-properties";

declare const properties: {
  version: number;
  qHyperCubeDef: {
    qAlwaysFullyExpanded: boolean;
    qDimensions: EngineAPI.INxDimension[];
    qMeasures: EngineAPI.INxMeasure[];
    qMode: "P";
    qSuppressMissing: boolean;
    qSuppressZero: boolean;
    qShowTotalsAbove: boolean;
    qInitialDataFetch: [
      {
        qTop: 0;
        qLeft: 0;
        qWidth: 50;
        qHeight: 50;
      },
    ];
    qIndentMode: boolean;
  };
  showTitles: boolean;
  title: "";
  subtitle: "";
  footnote: "";
  nullValueRepresentation: {
    text: "-";
  };
  components?: Component[];
};

export default properties;
