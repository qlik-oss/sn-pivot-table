import { useEffect, useMemo, useState } from "@nebula.js/stardust";
import type { PageInfo } from "../../hooks/use-pivot-table";
import type {
  Data,
  HeadersData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  TopDimensionData,
} from "../../types/types";
import createHeadersData from "./headers-data";
import { addPageToLeftDimensionData, createLeftDimensionData } from "./left-dimension-data";
import { addPageToMeasureData, createMeasureData } from "./measure-data";
import { addPageToTopDimensionData, createTopDimensionData } from "./top-dimension-data";

interface UsePVDataProps {
  qPivotDataPages: EngineAPI.INxPivotPage[];
  layoutService: LayoutService;
  pageInfo: PageInfo;
}

export const usePVData = ({ qPivotDataPages, layoutService, pageInfo }: UsePVDataProps): Data => {
  const { qHyperCube, snapshotData } = layoutService.layout;
  const dataPage = snapshotData?.content?.qPivotDataPages?.[0] ?? qHyperCube.qPivotDataPages[0];
  const [nextPage, setNextPage] = useState<EngineAPI.INxPivotPage | null>(null);
  const [newPage, setNewPage] = useState<EngineAPI.INxPivotPage | null>(null);

  const deriveMeasureDataFromProps = () => {
    const newData = createMeasureData(dataPage);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce(
      (nextData, page) => addPageToMeasureData({ prevData: nextData, nextDataPage: page, pageInfo }),
      newData
    );
  };

  const deriveTopDimensionDataFromProps = () => {
    const newData = createTopDimensionData(dataPage, layoutService);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce(
      (nextData, page) => addPageToTopDimensionData({ prevData: nextData, nextDataPage: page }),
      newData
    );
  };

  const deriveLeftDimensionDataFromProps = () => {
    const newData = createLeftDimensionData(dataPage, layoutService, pageInfo);
    // Resolve qPivotDataPages here as well, otherwise there could be double renders
    return qPivotDataPages.reduce(
      (nextData, page) => addPageToLeftDimensionData({ prevData: nextData, nextDataPage: page, pageInfo }),
      newData
    );
  };

  const [measureData, setMeasureData] = useState<MeasureData>(() => deriveMeasureDataFromProps());
  const [topDimensionData, setTopDimensionData] = useState<TopDimensionData>(() => deriveTopDimensionDataFromProps());
  const [leftDimensionData, setLeftDimensionData] = useState<LeftDimensionData>(() =>
    deriveLeftDimensionDataFromProps()
  );

  useEffect(() => {
    if (!nextPage) return;
    setMeasureData((prev) => addPageToMeasureData({ prevData: prev, nextDataPage: nextPage, pageInfo }));
    setTopDimensionData((prev) => addPageToTopDimensionData({ prevData: prev, nextDataPage: nextPage }));
    setLeftDimensionData((prev) => addPageToLeftDimensionData({ prevData: prev, nextDataPage: nextPage, pageInfo }));
  }, [nextPage, pageInfo]);

  useEffect(() => {
    if (!newPage) return;
    setMeasureData((prev) =>
      addPageToMeasureData({ prevData: prev, nextDataPage: newPage, isNewPage: true, pageInfo })
    );
    setTopDimensionData((prev) =>
      addPageToTopDimensionData({ prevData: prev, nextDataPage: newPage, isNewPage: true })
    );
    setLeftDimensionData((prev) =>
      addPageToLeftDimensionData({ prevData: prev, nextDataPage: newPage, isNewPage: true, pageInfo })
    );
  }, [newPage, pageInfo]);

  const headersData = useMemo<HeadersData>(
    () => createHeadersData(qHyperCube, topDimensionData.rowCount, leftDimensionData.dimensionInfoIndexMap),
    [qHyperCube, topDimensionData.rowCount, leftDimensionData.dimensionInfoIndexMap]
  );

  const nextPageHandler = (page: EngineAPI.INxPivotPage) => setNextPage(page);
  const newPageHandler = (page: EngineAPI.INxPivotPage) => {
    setNextPage(null);
    setNewPage(page);
  };

  return {
    headersData,
    measureData,
    topDimensionData,
    leftDimensionData,
    nextPageHandler,
    newPageHandler,
  };
};
