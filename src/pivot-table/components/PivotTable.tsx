import React, { useEffect, useState } from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, View, ScrollView, VirtualizedList } from "react-native";
import { Model } from '../../types/types';
import toMatrixData, { PivotData, Cell, Matrix } from '../handle-data';
import { Layout, NxPageArea, NxPivotPage } from '../../types/QIX';
import Column from './Column';

interface CellRendererProps {
  children: Array<JSX.Element>;
  onLayout: ({ nativeEvent: LayoutEvent }) => void;
}

interface RenderItemProps {
  item: Cell[];
  index: number;
}

export interface PivotTableProps {
  model: Model;
  layout: Layout;
}

const numberOfItemsPerPageList = [50, 100];

const tableStyles = StyleSheet.create({
  virtList: {
    height: '100%',
    flexGrow: 1,
  },
  column: {
    height: '100%',
    flex: 1,
  },
  scrollView: {
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    flexGrow: 1,
  },
  row: {
    minHeight: 24,
  },
});

const getNextPage = (qArea: NxPageArea) => {
  const { qTop, qHeight, qWidth } = qArea;

  return {
    qLeft: 0,
    qTop,
    qWidth: qWidth + 50,
    qHeight,
  };
};

const CellRenderer = ({ children, onLayout }: CellRendererProps) => (
  <View style={{ flexGrow: 1 }} onLayout={onLayout}>
    {children}
  </View>);
const keyExtractor = (item: Cell[]) => item.map(i => i.key).join(',');

export function PivotTable({ layout, model }: PivotTableProps): JSX.Element {
  const [pivotData, setPivotData] = useState<PivotData>({ matrix: [], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const [qArea, setArea] = useState<NxPageArea>(layout.qHyperCube.qPivotDataPages[0].qArea);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, layout.qHyperCube.qSize.qcy);

  useEffect(() => {
    console.log('LAYOUT CHANGED', layout);
    setArea(layout.qHyperCube.qPivotDataPages[0].qArea);
    setPivotData(toMatrixData(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
  }, [layout])

  useEffect(() => {
    console.log('pivotData', pivotData);
  }, [pivotData]);

  useEffect(() => {
    console.log('qArea', qArea);
  }, [qArea]);

  const onPageChange = (f: number) => {
    const { qLeft, qWidth } = qArea;
    const qPage = {
        qLeft,
        qTop: f,
        qWidth,
        qHeight: Math.min(50, layout.qHyperCube.qSize.qcy - f)
      };
      console.log('PRE-onPageChange', pivotData, qPage);

      model.getHyperCubePivotData({
      qPath: "/qHyperCubeDef",
      qPages: [qPage]
    }).then((d: Array<NxPivotPage>) => {
      if (d[0].qLeft.length) {
        console.log('POST-onPageChange', d[0]);
        const matrix = toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
        setPivotData(matrix);
        setArea(d[0].qArea);
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    });
  };

  const onEndReached = () => {
    if (qArea.qWidth >= layout.qHyperCube.qSize.qcx) {
      console.log('callback', qArea.qWidth, layout.qHyperCube.qSize.qcx);
      return;
    }

    const qPage = getNextPage(qArea);
    console.log('PRE-onEndReached', qPage);
    model.getHyperCubePivotData({
      "qPath": "/qHyperCubeDef",
      "qPages": [qPage]
    }).then((d: Array<NxPivotPage>) => {
      if (d[0].qData.length) {
        setArea(d[0].qArea);
        setPivotData(toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
        console.log('POST-onEndReached', d[0]);
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    });
  };

  const renderItem = ({ item, index }: RenderItemProps) => Column({ item, index, model, pivotData });
  const getItemCount = (data: Matrix) => data.length;
  const getItem = (data: Matrix, index: number) => data[index];

  return (
    <View style={{ height: '100%' }}>
      <ScrollView contentContainerStyle={tableStyles.scrollView}>
        <VirtualizedList
          horizontal
          data={pivotData.matrix}
          initialNumToRender={15}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemCount={getItemCount}
          getItem={getItem}
          onEndReached={onEndReached}
          contentContainerStyle={tableStyles.virtList}
          // windowSize={5}
          CellRendererComponent={CellRenderer}
        />
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(layout.qHyperCube.qSize.qcy / numberOfItemsPerPage)}
        onPageChange={p => {
          const f = p * numberOfItemsPerPage;
          setPage(p);
          onPageChange(f);
        }}
        label={`${from + 1}-${to} of ${layout.qHyperCube.qSize.qcy}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel='Rows per page'
      />
    </View>
  )
}
