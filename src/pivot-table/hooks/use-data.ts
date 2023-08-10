import { useOnPropsChange } from "@qlik-oss/nebula-table-utils/lib/hooks";
import { useCallback, useMemo, useState } from "react";
import type {
  Data,
  HeadersData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  PageInfo,
  TopDimensionData,
} from "../../types/types";
import createHeadersData from "../data/headers-data";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../data/left-dimension-data";
import { addPageToMeasureData, createMeasureData } from "../data/measure-data";
import { addPageToTopDimensionData, createTopDimensionData } from "../data/top-dimension-data";

const useData = (qPivotDataPages: EngineAPI.INxPivotPage[], layoutService: LayoutService, pageInfo: PageInfo): Data => {
  const { qHyperCube } = layoutService.layout;
  const [nextPage, setNextPage] = useState<EngineAPI.INxPivotPage | null>(null);

  const deriveMeasureDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce(
          (prevData, nextDataPage) => addPageToMeasureData({ prevData, nextDataPage, pageInfo }),
          createMeasureData(qPivotDataPages[0], pageInfo)
        ),
    [qPivotDataPages, pageInfo]
  );

  const deriveTopDimensionDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce(
          (prevData, nextDataPage) => addPageToTopDimensionData({ prevData, nextDataPage, layoutService }),
          createTopDimensionData(qPivotDataPages[0], layoutService)
        ),
    [layoutService, qPivotDataPages]
  );

  const deriveLeftDimensionDataFromProps = useCallback(
    () =>
      qPivotDataPages
        .slice(1)
        .reduce(
          (prevData, nextDataPage) => addPageToLeftDimensionData({ prevData, nextDataPage, pageInfo, layoutService }),
          createLeftDimensionData(qPivotDataPages[0], layoutService, pageInfo)
        ),
    [layoutService, qPivotDataPages, pageInfo]
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
    setMeasureData((prevData) => addPageToMeasureData({ prevData, nextDataPage: nextPage, pageInfo }));
    setTopDimensionData((prevData) => addPageToTopDimensionData({ prevData, nextDataPage: nextPage, layoutService }));
    setLeftDimensionData((prevData) =>
      addPageToLeftDimensionData({ prevData, nextDataPage: nextPage, pageInfo, layoutService })
    );
    // we dont need dependency of pageInfo
    // this causes a rerender to add unrelevant data into grids
    // the reson for why we dont need it as dependancy is because
    // when a page changes -> we fetch new data (in supernova level) and trigger a new render
    // that means the entire react tree will be recreated -> so pageInfo here will be the most updated one!
    // and adding it as a dependency will trigger this hook that would result in extra unrelevant data (basically previous batch/page)
    // being added in to grids
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
