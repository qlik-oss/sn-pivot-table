import { useCallback, useMemo, useState } from "react";
import { SnapshotData } from "../../types/QIX";
import { Data, HeadersData, LeftDimensionData, MeasureData, TopDimensionData } from "../../types/types";
import createHeadersData from "../data/headers-data";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../data/left-dimension-data";
import { addPageToMeasureData, createMeasureData } from "../data/measure-data";
import { addPageToTopDimensionData, createTopDimensionData } from "../data/top-dimension-data";
import useOnPropsChange from "./use-on-props-change";

const useData = (
  qPivotDataPages: EngineAPI.INxPivotPage[],
  qHyperCube: EngineAPI.IHyperCube,
  snapshotData: SnapshotData | undefined
): Data => {
  const dataPage = snapshotData?.content?.qPivotDataPages?.[0] ?? qHyperCube.qPivotDataPages[0];
  const [nextPage, setNextPage] = useState<EngineAPI.INxPivotPage | null>(null);
  const [moreDataPage, setMoreDataPage] = useState<EngineAPI.INxPivotPage | null>(null);
  const deriveMeasureDataFromProps = useCallback(() => {
    const newData = createMeasureData(dataPage, !!snapshotData);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce((nextData, page) => addPageToMeasureData(nextData, page), newData);
  }, [dataPage, qPivotDataPages, snapshotData]);

  const deriveTopDimensionDataFromProps = useCallback(() => {
    const newData = createTopDimensionData(dataPage, qHyperCube, !!snapshotData);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce((nextData, page) => addPageToTopDimensionData(nextData, page), newData);
  }, [dataPage, qHyperCube, qPivotDataPages, snapshotData]);

  const deriveLeftDimensionDataFromProps = useCallback(() => {
    const newData = createLeftDimensionData(dataPage, qHyperCube, !!snapshotData);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce((nextData, page) => addPageToLeftDimensionData(nextData, page), newData);
  }, [dataPage, qHyperCube, qPivotDataPages, snapshotData]);

  const [measureData, setMeasureData] = useState<MeasureData>(() => deriveMeasureDataFromProps());
  const [topDimensionData, setTopDimensionData] = useState<TopDimensionData>(() => deriveTopDimensionDataFromProps());
  const [leftDimensionData, setLeftDimensionData] = useState<LeftDimensionData>(() =>
    deriveLeftDimensionDataFromProps()
  );

  useOnPropsChange(() => {
    setMeasureData(deriveMeasureDataFromProps());
  }, [deriveMeasureDataFromProps]);

  useOnPropsChange(() => {
    setTopDimensionData(deriveTopDimensionDataFromProps());
  }, [deriveTopDimensionDataFromProps]);

  useOnPropsChange(() => {
    setLeftDimensionData(deriveLeftDimensionDataFromProps());
  }, [deriveLeftDimensionDataFromProps]);

  useOnPropsChange(() => {
    if (!nextPage) return;
    setMeasureData((prev) => addPageToMeasureData(prev, nextPage));
    setTopDimensionData((prev) => addPageToTopDimensionData(prev, nextPage));
    setLeftDimensionData((prev) => addPageToLeftDimensionData(prev, nextPage));
  }, [nextPage]);

  useOnPropsChange(() => {
    if (!moreDataPage) return;
    setMeasureData((prev) => addPageToMeasureData(prev, moreDataPage));
  }, [moreDataPage]);

  const headersData = useMemo<HeadersData>(
    () => createHeadersData(qHyperCube, topDimensionData.size.y, leftDimensionData.dimensionInfoIndexMap),
    [qHyperCube, topDimensionData.size.y, leftDimensionData.dimensionInfoIndexMap]
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
    moreDataHandler,
  };
};

export default useData;
