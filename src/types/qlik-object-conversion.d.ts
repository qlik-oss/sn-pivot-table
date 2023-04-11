declare module "qlik-object-conversion" {
  interface ExtendedHyperCubeDef extends Omit<EngineAPI.IVisualizationHyperCubeDef, "qNoOfLeftDims"> {
    qNoOfLeftDims?: number;
  }
  interface ExtendedGenericHyperCubeProperties extends EngineAPI.IGenericHyperCubeProperties {
    qLayoutExclude: {
      quarantine: {
        pivotInterColSortOrder?: number[];
        interColSortOrder?: number[];
      };
    };
    qHyperCubeDef: ExtendedHyperCubeDef;
  }

  export interface PropTree {
    qChildren: unknown[];
    qProperty: ExtendedGenericHyperCubeProperties;
  }

  export interface ExportFormat {
    data: unknown[];
    properties: ExtendedGenericHyperCubeProperties;
  }

  type ImportPropertiesProps = {
    exportFormat: ExportFormat;
    initialProperties: EngineAPI.IGenericHyperCubeProperties;
    dataDefinition: unknown;
    hypercubePath: string;
  };

  type ExportPropertiesProps = {
    propertyTree: PropTree;
    hyperCubePath: string;
  };

  type QuarantineArrayProps = {
    properties: EngineAPI.IGenericHyperCubeProperties;
    arrayPath: string;
    quarantineName: string;
    arrayName: string;
    itemPath: string;
  };

  interface Conversion {
    hypercube: {
      importProperties: (props: ImportPropertiesProps) => PropTree;
      exportProperties: (props: ExportPropertiesProps) => ExportFormat;
    };
    quarantineProperty: (properties: ExtendedGenericHyperCubeProperties, path: string, property: string) => void;
    unquarantineProperty: (properties: ExtendedGenericHyperCubeProperties, property: string) => void;
    conditionalShow: {
      quarantine: (properties: ExtendedGenericHyperCubeProperties) => void;
      unquarantine: (properties: ExtendedGenericHyperCubeProperties) => void;
    };
    quarantineArrayProp: (props: QuarantineArrayProps) => void;
    unquarantineArrayProp: (props: QuarantineArrayProps) => void;
  }

  const conversion: Conversion;
  export default conversion;
}
