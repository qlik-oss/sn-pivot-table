import { useElement, useStaleLayout, useEffect, useModel, useState } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import toMatrixData from './pivot-table/handle-data';
import { render, teardown } from './pivot-table/Root';
import { Layout, NxPivotPage } from './types/QIX';
import toMatrix from './pivot-table/handle-data';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova() {
  return {
    qae: {
      properties: {
        initial: properties,
      },
      data,
    },
    component() {
      const element = useElement();
      const layout = useStaleLayout();
      const model = useModel();
      // const [pivotData, setPivotData] = useState();

      // const onPageChange = (from: number) => {
      //   const { qLeft, qWidth } = layout.qHyperCube.qPivotDataPages[0].qArea;
      //   const qPage = {
      //       qLeft,
      //       qTop: from,
      //       qWidth,
      //       qHeight: Math.min(50, layout.qHyperCube.qSize.qcy - from)
      //     };
      //     console.log('PRE-onPageChange', pivotData, qPage);

      //     model.getHyperCubePivotData({
      //     "qPath": "/qHyperCubeDef",
      //     "qPages": [qPage]
      //   }).then((d: Array<NxPivotPage>) => {
      //     if (d[0].qLeft.length) {
      //       console.log('POST-onPageChange', d[0]);
      //       const matrix = toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      //       setPivotData(matrix);
      //     }
      //   }).catch((err: Error) => {
      //     console.log('ERROR', err)
      //   });
      // };

      // const onEndReached = (d: Array<NxPivotPage>) => {
      //   layout.qHyperCube.qPivotDataPages = d;
      //   // const matrix = toMatrixData(d[0], layout.qHyperCube.qDimensionInfo);
      //   // matrix.matrix.splice(0, matrix.nbrLeftColumns);
      //   // pivotData.matrix.push(...matrix.matrix);
      //   // setPivotData({ ...pivotData });
      //   setPivotData(toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
      // }


      // useEffect(() => {
      //   console.log('LAYOUT CHANGED', layout.title, layout);
      //   const matrix = toMatrixData(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      //   console.log('MATRIX', layout.title, matrix);
      //   console.log('SIZE', layout.title, layout.qHyperCube.qSize.qcx);
      //   setPivotData(matrix);
      // }, [layout]);

      // useEffect(() => {
      //   console.log('pivotData', pivotData);
      // }, [pivotData])

      useEffect(() => {
        if (layout && model) {
          render(element, {
            // pivotData,
            model,
            // onEndReached,
            // onPageChange,
            layout
          });
        }
      }, [layout, model]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
