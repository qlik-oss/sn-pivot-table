import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, View, ScrollView, VirtualizedList } from "react-native";
import { Model } from '../../types/types';
import toMatrixData, { PivotData, Cell, Matrix } from '../handle-data';
import { Layout, NxPageArea } from '../../types/QIX';
import Column from './Column';

interface CellRendererProps {
  children: Array<JSX.Element>;
}

interface RenderItemProps {
  item: Cell[];
  index: number;
}

export interface PivotTableProps {
  model: Model;
  layout: Layout;
}

interface BatchedState {
  pivotData: PivotData;
  area: NxPageArea;
  page: number;
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

const CellRenderer = ({ children, ...props }: CellRendererProps) =>
   ( // eslint-disable-next-line react/jsx-props-no-spreading
    <View {...props} style={{ flexGrow: 1 }}>
      {children}
    </View>
  )
;
const keyExtractor = (item: Cell[]) => item.map(i => i.key).join(',');
const getItemCount = (data: Matrix) => data.length;
const getItem = (data: Matrix, index: number) => data[index];

export function PivotTable({ layout, model }: PivotTableProps): JSX.Element {
  const [pivotData, setPivotData] = useState<PivotData>({ matrix: [], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const [qArea, setArea] = useState<NxPageArea>(layout.qHyperCube.qPivotDataPages[0].qArea);
  const [page, setPage] = useState(0);
  const [batchedState, setBatchedState] = useState<BatchedState>(); // setState call inside async functions are not batched. This is a hack get around multiple unwanted renders for each setState call.
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, layout.qHyperCube.qSize.qcy);

  useMemo(() => {
    if (batchedState) {
      setPivotData(batchedState.pivotData);
      setArea(batchedState.area);
      setPage(batchedState.page);
    }
  }, [batchedState]);

  useMemo(() => {
    console.log('LAYOUT CHANGED', layout);
    setPage(0);
    setArea(layout.qHyperCube.qPivotDataPages[0].qArea);
    setPivotData(toMatrixData(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
  }, [layout]);

  useEffect(() => {
    console.log('HAS RENDERED');
  });

  useMemo(() => {
    console.log('pivotData', pivotData);
  }, [pivotData]);

  const loadPageHandler = useCallback(async (p: number) => {
    const f = p * numberOfItemsPerPage;
    const qPage = {
        qLeft: 0,
        qTop: f,
        qWidth: 50,
        qHeight: Math.min(50, layout.qHyperCube.qSize.qcy - f)
      };
      try {
        const d = await model.getHyperCubePivotData({
          qPath: "/qHyperCubeDef",
          qPages: [qPage]
        });
        console.log('POST-onPageChange', d[0]);
        const matrix = toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
        setBatchedState({
          pivotData: matrix,
          area: d[0].qArea,
          page: p,
        });
      } catch (error) {
        console.log('ERROR', error)
      }
  }, [model, layout]);

  const endReachedHandler = useCallback(async () => {
    if (qArea.qWidth >= layout.qHyperCube.qSize.qcx) {
      console.log('No more data to load', qArea.qWidth, layout.qHyperCube.qSize.qcx);
      return;
    }

    try {
      const d = await model.getHyperCubePivotData({
        "qPath": "/qHyperCubeDef",
        "qPages": [getNextPage(qArea)]
      });
      const matrix = toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setBatchedState({
        pivotData: matrix,
        area: d[0].qArea,
        page,
      });
      console.log('POST-onEndReached', d[0]);
    } catch (error) {
      console.log('ERROR', error);
    }
  }, [qArea, model, layout]);

  const renderItem = useCallback(
    ({ item, index }: RenderItemProps) => Column({ item, index, model, pivotData }),
    [model, pivotData]
  );

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
          onEndReached={endReachedHandler}
          contentContainerStyle={tableStyles.virtList}
          // windowSize={5}
          CellRendererComponent={CellRenderer}
        />
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(layout.qHyperCube.qSize.qcy / numberOfItemsPerPage)}
        onPageChange={loadPageHandler}
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
