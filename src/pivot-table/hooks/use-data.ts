import { useCallback, useMemo, useState } from 'react';
import { MeasureData, TopDimensionData, Data, HeadersData, LeftDimensionData } from '../../types/types';
import { addPageToTopDimensionData, createTopDimensionData } from '../data/top-dimension-data';
import { addPageToMeasureData, createMeasureData } from '../data/measure-data';
import { addPageToLeftDimensionData, createLeftDimensionData } from '../data/left-dimension-data';
import createHeadersData from '../data/headers-data';

const useData = (
  qPivotDataPages: EngineAPI.INxPivotPage[],
  qHyperCube: EngineAPI.IHyperCube
): Data => {
  const [nextPage, setNextPage] = useState<EngineAPI.INxPivotPage | null>(null);
  const [moreDataPage, setMoreDataPage] = useState<EngineAPI.INxPivotPage | null>(null);
  const deriveMeasureDataFromProps = useCallback(() => {
      const newData = createMeasureData(qHyperCube.qPivotDataPages[0]);
      // Resolve qPivotDataPages here as well, otherwise there could be double renders
      return qPivotDataPages.reduce((nextData, page) => addPageToMeasureData(nextData, page), newData);
    },
    [qHyperCube, qPivotDataPages]
  );

  const deriveTopDimensionDataFromProps = useCallback(
    () => {
      const newData = createTopDimensionData(qHyperCube.qPivotDataPages[0], qHyperCube);
      // Resolve qPivotDataPages here as well, otherwise there could be double renders
      return qPivotDataPages.reduce((nextData, page) => addPageToTopDimensionData(nextData, page), newData);
    },
    [qHyperCube, qPivotDataPages]
  );

  const deriveLeftDimensionDataFromProps = useCallback(
    () => {
      const newData = createLeftDimensionData(qHyperCube.qPivotDataPages[0], qHyperCube);
      // Resolve qPivotDataPages here as well, otherwise there could be double renders
      return qPivotDataPages.reduce((nextData, page) => addPageToLeftDimensionData(nextData, page), newData);
    },
    [qHyperCube, qPivotDataPages]
  );


  const [measureData, setMeasureData] = useState<MeasureData>(() => deriveMeasureDataFromProps());
  const [topDimensionData, setTopDimensionData] = useState<TopDimensionData>(() => deriveTopDimensionDataFromProps());
  const [leftDimensionData, setLeftDimensionData] = useState<LeftDimensionData>(() => deriveLeftDimensionDataFromProps());

  useMemo(() => {
    setMeasureData(deriveMeasureDataFromProps());
  }, [deriveMeasureDataFromProps]);

  useMemo(() => {
    setTopDimensionData(deriveTopDimensionDataFromProps());
  }, [deriveTopDimensionDataFromProps]);

  useMemo(() => {
    setLeftDimensionData(deriveLeftDimensionDataFromProps());
  }, [deriveLeftDimensionDataFromProps]);

  useMemo(() => {
    if (!nextPage) return;
    setMeasureData(prev => addPageToMeasureData(prev, nextPage));
    setTopDimensionData(prev => addPageToTopDimensionData(prev, nextPage));
    setLeftDimensionData(prev => addPageToLeftDimensionData(prev, nextPage));
  }, [nextPage]);

  useMemo(() => {
    if (!moreDataPage) return;
    setMeasureData(prev => addPageToMeasureData(prev, moreDataPage));
  }, [moreDataPage]);

  const headersData = useMemo<HeadersData>(
    () => createHeadersData(qHyperCube, topDimensionData, leftDimensionData),
    [qHyperCube, topDimensionData.size.y, ...leftDimensionData.dimensionInfoIndexMap]
  );

  const hasMoreRows = useMemo<boolean>(
    () => measureData.size.y < qHyperCube.qSize.qcy,
    [measureData.size.y, qHyperCube.qSize.qcy]
  );

  const hasMoreColumns = useMemo<boolean>(
    () => measureData.size.x < qHyperCube.qSize.qcx,
    [measureData.size.x, qHyperCube.qSize.qcx]
  );

  const nextPageHandler = useCallback((page: EngineAPI.INxPivotPage) => {
    setNextPage(page);
  }, []);

  const moreDataHandler = useCallback((page: EngineAPI.INxPivotPage) => {
    setMoreDataPage(page);
  }, []);

  return {
    headersData,
    measureData,
    topDimensionData,
    leftDimensionData,
    hasMoreRows,
    hasMoreColumns,
    nextPageHandler,
    moreDataHandler
  };
};

export default useData;
