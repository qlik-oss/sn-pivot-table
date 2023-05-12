import { useCallback, useMemo, useState } from "react";
import type {
  Data,
  HeadersData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  TopDimensionData,
} from "../../types/types";
import createHeadersData from "../data/headers-data";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../data/left-dimension-data";
import { addPageToMeasureData, createMeasureData } from "../data/measure-data";
import { addPageToTopDimensionData, createTopDimensionData } from "../data/top-dimension-data";
import useOnPropsChange from "./use-on-props-change";

const useData = (qPivotDataPages: EngineAPI.INxPivotPage[], layoutService: LayoutService): Data => {
  const { qHyperCube } = layoutService.layout;
  const [nextPage, setNextPage] = useState<EngineAPI.INxPivotPage | null>(null);

  const deriveMeasureDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce((nextData, page) => addPageToMeasureData(nextData, page), createMeasureData(qPivotDataPages[0])),
    [qPivotDataPages]
  );

  const deriveTopDimensionDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce(
          (nextData, page) => addPageToTopDimensionData(nextData, page),
          createTopDimensionData(qPivotDataPages[0], layoutService)
        ),
    [layoutService, qPivotDataPages]
  );

  const deriveLeftDimensionDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce(
          (nextData, page) => addPageToLeftDimensionData(nextData, page),
          createLeftDimensionData(qPivotDataPages[0], layoutService)
        ),
    [layoutService, qPivotDataPages]
  );

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

  const headersData = useMemo<HeadersData>(
    () => createHeadersData(qHyperCube, topDimensionData.rowCount, leftDimensionData.dimensionInfoIndexMap),
    [qHyperCube, topDimensionData.rowCount, leftDimensionData.dimensionInfoIndexMap]
  );

  const nextPageHandler = useCallback((page: EngineAPI.INxPivotPage) => {
    setNextPage(page);
  }, []);

  return {
    headersData,
    measureData,
    topDimensionData,
    leftDimensionData,
    nextPageHandler,
  };
};

export default useData;
