import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, View, ScrollView, VirtualizedList, Text } from "react-native";
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';
import { Model } from '../../types/types';
import toMatrixData, { TYPE, PivotData, Cell } from '../handle-data';
import { Layout, NxPivotPage } from '../../types/QIX';
import sharedStyles from './shared-styles';
import ColumnTable from './ColumnTable';

interface CellRendererProps {
  children: Array<JSX.Element>;
  onLayout: ({ nativeEvent: LayoutEvent }) => void;
}

interface RenderItemProps {
  item: Array<Cell>;
  index: number;
}

export interface PivotTableProps {
  // pivotData: PivotData;
  model: Model;
  layout: Layout;
  // onPageChange: (fromPage: number) => void;
  // onEndReached: (d: Array<NxPivotPage>) => void;
}

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

const getNextPage = (layout: Layout) => {
  const { qLeft, qTop, qHeight, qWidth } = layout.qHyperCube.qPivotDataPages[0].qArea;
  // const left = Math.min(layout.qHyperCube.qSize.qcx, qLeft + 50);
  return {
    qLeft: 0,
    qTop,
    qWidth: qWidth + 50, // Math.min(50, layout.qHyperCube.qSize.qcx - left),
    qHeight,
  };
};


export const PivotTable = ({ layout, model }: PivotTableProps): JSX.Element => {
  const scrollViewElm = useRef<ScrollView>(null);
  const [pivotData, setPivotData] = useState<PivotData>({ matrix: [], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const numberOfItemsPerPageList = [50, 100];
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, layout.qHyperCube.qSize.qcy);
  const firstUpdate = useRef(true);
  const [scrollToIndex, setScrollToIndex] = useState(0);
console.log('HERERE');
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      console.log('FIRST');
      firstUpdate.current = false;
    }
  });

  const onPageChange = (f: number) => {
    const { qLeft, qWidth } = layout.qHyperCube.qPivotDataPages[0].qArea;
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
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    });
  };

  const callback = () => {
    console.log('ON REACH END');
    if (layout.qHyperCube.qPivotDataPages[0].qArea.qWidth >= layout.qHyperCube.qSize.qcx) {
      console.log('callback', layout.qHyperCube.qPivotDataPages[0].qArea.qWidth, layout.qHyperCube.qSize.qcx);
      return;
    }

    const qPage = getNextPage(layout);
    console.log('PRE-onEndReached', qPage);
    model.getHyperCubePivotData({
      "qPath": "/qHyperCubeDef",
      "qPages": [qPage]
    }).then((d: Array<NxPivotPage>) => {
      if (d[0].qData.length) {
        layout.qHyperCube.qPivotDataPages = d;
        setPivotData(toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
        setScrollToIndex(scrollToIndex);
        console.log('POST-onEndReached', d[0]);
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    }).finally(() => {
      console.log('FINALLY');
    });
  };

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  useEffect(() => {
    console.log('LAYOUT CHANGED');
    setPivotData(toMatrixData(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
  }, [layout])

  useEffect(() => {
    console.log('pivotData', pivotData);
  }, [pivotData])

  const renderCell = (cell: Cell, rowIndex = 0, colIndex = 0) => {
    if (cell.type === TYPE.DIMENSION) {
      return <DimensionCell
        cell={cell}
        model={model}
        rowIndex={rowIndex}
        colIndex={colIndex}
        style={sharedStyles.cell}
        isLeftColumn
      />
    }

    if (cell.type === TYPE.MEASURE) {
      return <MeasureCell
        cell={cell}
        style={sharedStyles.cell}
        nullStyle={sharedStyles.nullCell}
      />
    }

    return <DataTable.Cell style={sharedStyles.cell}>{null}</DataTable.Cell>
  };

  const renderTitle = (cell: Cell, rowIndex: number, colIdx: number) => {
    if (cell.type === TYPE.LABEL) {
      return (
        <DataTable.Title style={sharedStyles.header}>
          {cell.value}
        </DataTable.Title>)
    }

    if (cell.type === TYPE.DIMENSION) {
      return <DimensionCell
        cell={cell}
        model={model}
        rowIndex={rowIndex}
        colIndex={colIdx - pivotData.nbrLeftColumns}
        style={sharedStyles.cell}
        isLeftColumn={false}
      />
    }

    return <DataTable.Cell style={sharedStyles.cell}>{null}</DataTable.Cell>
  };

  const renderColumn = ({ item: col, index: colIndex }: RenderItemProps) => (
    <View style={tableStyles.column}>
      <DataTable>
        {col.slice(0, pivotData.nbrTopRows).map(((cell, rowIndex) => (
          <DataTable.Header key={cell.key}>
            {renderTitle(cell, rowIndex, colIndex)}
          </DataTable.Header>
        )))}

        {col.slice(pivotData.nbrTopRows).map((cell, rowIndex) => (
          <DataTable.Row style={tableStyles.row} key={cell.key}>
            {renderCell(cell, rowIndex)}
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );

  const CellRenderer = ({ children }: CellRendererProps) => (<View style={{ flexGrow: 1 }}>{children}</View>);

  const CellRenderer2 = ({ children }: CellRendererProps) => (<View style={{ flexGrow: 1, display: 'flex' }}>{children}</View>);

  const getItem = (data: any, index: number) => data[index];
  const getItemCount =  (data: any) => data.length;
  const keyExtractor = (item: Cell[]) => item.map(i => i.key).join(',');

  return (
    // <DataTable style={{ height: '100%' }}>
      /* <ScrollView contentContainerStyle={tableStyles.scrollView} ref={scrollViewElm}> */
        <VirtualizedList
          horizontal
          // data={pivotData.matrix}
          data={[]}
          renderItem={({ item, index }) => ColumnTable({ item, index, model })}
          keyExtractor={keyExtractor}
          contentContainerStyle={tableStyles.virtList}
          // getItem={getItem}
          getItem={(_, index) => pivotData.matrix[index]}
          // getItemCount={getItemCount}
          getItemCount={() => pivotData.matrix.length}
          // CellRendererComponent={CellRenderer2}
          onEndReached={callback}
          // onEndReachedThreshold={1}
          initialNumToRender={50}
          // maxToRenderPerBatch={1}
          // updateCellsBatchingPeriod={1000}
          // windowSize={10}
          // removeClippedSubviews
          // onViewableItemsChanged={() => console.log('onViewableItemsChanged')}
        />
      /* </ScrollView> */
    //   <DataTable.Pagination
    //     page={page}
    //     numberOfPages={Math.ceil(layout.qHyperCube.qSize.qcy / numberOfItemsPerPage)}
    //     onPageChange={p => {
    //       const f = p * numberOfItemsPerPage;
    //       setPage(p);
    //       onPageChange(f);
    //       scrollViewElm.current?.scrollTo({ x: 0, y: 0, animated: false });
    //     }}
    //     label={`${from + 1}-${to} of ${layout.qHyperCube.qSize.qcy}`}
    //     showFastPaginationControls
    //     numberOfItemsPerPageList={numberOfItemsPerPageList}
    //     numberOfItemsPerPage={numberOfItemsPerPage}
    //     onItemsPerPageChange={onItemsPerPageChange}
    //     selectPageDropdownLabel='Rows per page'
    //   />
    // </DataTable>
  )

}

export function Testing({ layout, model }: PivotTableProps): JSX.Element {
  const [pivotData, setPivotData] = useState<PivotData>({ matrix: [], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const numberOfItemsPerPageList = [50, 100];
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, layout.qHyperCube.qSize.qcy);

  useEffect(() => {
    console.log('LAYOUT CHANGED', layout);
    setPivotData(toMatrixData(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
  }, [layout])

  useEffect(() => {
    console.log('pivotData', pivotData);
  }, [pivotData]);

  const onPageChange = (f: number) => {
    const { qLeft, qWidth } = layout.qHyperCube.qPivotDataPages[0].qArea;
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
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    });
  };

  const callback = () => {
    if (layout.qHyperCube.qPivotDataPages[0].qArea.qWidth >= layout.qHyperCube.qSize.qcx) {
      console.log('callback', layout.qHyperCube.qPivotDataPages[0].qArea.qWidth, layout.qHyperCube.qSize.qcx);
      return;
    }

    const qPage = getNextPage(layout);
    console.log('PRE-onEndReached', qPage);
    model.getHyperCubePivotData({
      "qPath": "/qHyperCubeDef",
      "qPages": [qPage]
    }).then((d: Array<NxPivotPage>) => {
      if (d[0].qData.length) {
        layout.qHyperCube.qPivotDataPages = d;
        setPivotData(toMatrixData(d[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims))
        console.log('POST-onEndReached', d[0]);
      }
    }).catch((err: Error) => {
      console.log('ERROR', err)
    }).finally(() => {
      console.log('FINALLY');
    });
  };

  const CellRenderer = ({ children, onLayout }: CellRendererProps) => (
    <View style={{ flexGrow: 1 }} onLayout={onLayout}>
      {children}
    </View>);
  const keyExtractor = (item: Cell[]) => item.map(i => i.key).join(',');

  return (
    <DataTable style={{ height: '100%' }}>
      <ScrollView contentContainerStyle={tableStyles.scrollView}>
        <VirtualizedList
        horizontal
        data={pivotData.matrix}
        initialNumToRender={15}
        renderItem={({ item, index }) => ColumnTable({ item, index, model, pivotData })}
        keyExtractor={keyExtractor}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        onEndReached={callback}
        contentContainerStyle={tableStyles.virtList}
        windowSize={5}
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
          // scrollViewElm.current?.scrollTo({ x: 0, y: 0, animated: false });
        }}
        label={`${from + 1}-${to} of ${layout.qHyperCube.qSize.qcy}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel='Rows per page'
      />
    </DataTable>
  )
}
