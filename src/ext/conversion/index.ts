/* eslint-disable no-param-reassign, no-plusplus */
import { setValue } from "qlik-chart-modules";
import conversion, { ExportFormat, PropTree } from "qlik-object-conversion";
import createDataDefinition from "../../qae/data-definition";
import { Galaxy } from "../../types/types";
import totalMode from "./total-mode";

export function createImportProperties(env: Galaxy) {
  const dataDefinition = createDataDefinition(env);

  return (
    exportFormat: ExportFormat,
    initialProperties: EngineAPI.IGenericHyperCubeProperties,
    extension: unknown,
    hypercubePath: string
  ): PropTree => {
    // Add color attribute expression
    const propTree = conversion.hypercube.importProperties({
      exportFormat,
      initialProperties,
      dataDefinition: dataDefinition.targets[0],
      hypercubePath,
    });
    const dimensions = propTree.qProperty?.qHyperCubeDef?.qDimensions || [];
    const numDimensions = dimensions.length;
    const numMeasures = propTree.qProperty?.qHyperCubeDef?.qMeasures?.length || 0;
    let interColSortOrder = propTree.qProperty?.qHyperCubeDef?.qInterColumnSortOrder || [];
    let lastPivotSortOrder: number[] | undefined;
    let restoreNoOfLeftDims = true;

    if (numDimensions + numMeasures === interColSortOrder.length) {
      // Save hypercube sort order
      setValue(propTree, "qProperty.qLayoutExclude.quarantine.interColSortOrder", interColSortOrder.concat());
    }
    const pivotInterColSortOrder = propTree?.qProperty?.qLayoutExclude?.quarantine?.pivotInterColSortOrder || undefined;
    if (pivotInterColSortOrder) {
      // Restore pivot sort order
      interColSortOrder = pivotInterColSortOrder;
      lastPivotSortOrder = [...pivotInterColSortOrder];
      setValue(propTree, "qProperty.qHyperCubeDef.qInterColumnSortOrder", interColSortOrder);
      delete propTree.qProperty.qLayoutExclude.quarantine.pivotInterColSortOrder;
    } else {
      // Reset column sort order as a pivot table doesn not allow a custom sorting order
      interColSortOrder.length = 0;
    }

    const pseudoShift = +(interColSortOrder.indexOf(-1) > -1); // Shift dimensions if pseudoDim already exists
    const totalSortLength = numDimensions + pseudoShift;
    if (totalSortLength > interColSortOrder.length) {
      // inject dimensions that were added since pivotInterColSortOrder was last saved
      for (let i = interColSortOrder.length; i < totalSortLength; i++) {
        if (interColSortOrder.indexOf(i) < 0) {
          interColSortOrder.push(i - pseudoShift);
        }
      }
    }

    for (let i = interColSortOrder.length - 1; i >= 0; i--) {
      // remove dimension indices that no longer exist
      if (interColSortOrder[i] >= numDimensions) {
        interColSortOrder.splice(i, 1);
      }
    }

    if (numMeasures > 1 && interColSortOrder.indexOf(-1) < 0) {
      // add pseudo index if needed
      interColSortOrder.push(-1);
    } else if (numMeasures < 2 && interColSortOrder.indexOf(-1) > -1) {
      // remove pseudo index if not needed
      interColSortOrder.splice(interColSortOrder.indexOf(-1), 1);
    }

    const qNoOfLeftDims = propTree?.qProperty?.qHyperCubeDef?.qNoOfLeftDims ?? -1;
    if (numDimensions > 0 && qNoOfLeftDims === -1) {
      // set noOfLeftDims if not initiated
      setValue(propTree, "qProperty.qHyperCubeDef.qNoOfLeftDims", numDimensions);
    }

    // restore noOfLeftDims only if interColSortOrder hasn't changed since the last time it was saved
    if (lastPivotSortOrder && interColSortOrder && lastPivotSortOrder.length === interColSortOrder.length) {
      for (let i = 0; i < lastPivotSortOrder.length; i++) {
        if (lastPivotSortOrder[i] !== interColSortOrder[i]) {
          restoreNoOfLeftDims = false;
          break;
        }
      }

      if (restoreNoOfLeftDims) {
        conversion.unquarantineProperty(propTree.qProperty, "noOfLeftDims");
      }
    }

    conversion.conditionalShow.unquarantine(propTree.qProperty);
    totalMode.unquarantine(propTree.qProperty as EngineAPI.IGenericHyperCubeProperties);

    return propTree;
  };
}

export function exportProperties(propertyTree: PropTree, hyperCubePath: string): ExportFormat {
  const exportSortOrder = propertyTree?.qProperty?.qHyperCubeDef?.qInterColumnSortOrder ?? [];
  const pivotSortOrder = exportSortOrder.slice();
  // Remove the pseudo dim
  const pseudoIdx = exportSortOrder.indexOf(-1);
  if (pseudoIdx > -1) {
    exportSortOrder.splice(pseudoIdx, 1);
  }

  const expFormat = conversion.hypercube.exportProperties({
    propertyTree,
    hyperCubePath,
  });

  const hypercube = expFormat.properties.qHyperCubeDef as EngineAPI.IHyperCubeDef;
  const numDimensions = hypercube.qDimensions.length;
  const numMeasures = hypercube.qMeasures.length;
  let interColSortOrder = hypercube.qInterColumnSortOrder;

  // Save pivot sort order
  setValue(expFormat, "properties.qLayoutExclude.quarantine.pivotInterColSortOrder", pivotSortOrder);
  // save number of left dims
  conversion.quarantineProperty(expFormat.properties, "qHyperCubeDef.qNoOfLeftDims", "noOfLeftDims");
  delete expFormat.properties.qHyperCubeDef.qNoOfLeftDims;

  const hypercubeInterColSortOrder = expFormat?.properties?.qLayoutExclude?.quarantine?.interColSortOrder;
  if (hypercubeInterColSortOrder) {
    // Restore hypercube sort order
    interColSortOrder = hypercubeInterColSortOrder;
    setValue(expFormat, "properties.qHyperCubeDef.qInterColumnSortOrder", interColSortOrder);
    setValue(expFormat, "data.0.interColumnSortOrder", interColSortOrder);
    delete expFormat.properties.qLayoutExclude.quarantine.interColSortOrder;
  }

  for (let i = interColSortOrder.length; i < numDimensions + numMeasures; i++) {
    if (interColSortOrder.length <= i) {
      interColSortOrder.push(i);
    }
  }

  conversion.conditionalShow.quarantine(expFormat.properties);
  totalMode.quarantine(expFormat.properties as EngineAPI.IGenericHyperCubeProperties);

  return expFormat;
}
