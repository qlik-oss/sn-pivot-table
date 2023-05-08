import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { PageInfo } from "../../hooks/use-pivot-table";
import type { Model } from "../../types/QIX";
import type { Data, DataModel } from "../../types/types";
import { useStyleContext } from "../contexts/StyleProvider";
import useDataModel from "../hooks/use-data-model";
import { Disclaimer } from "./Disclaimer";
import { Pagination } from "./Pagination";
import { StickyPivotTable, type PivotTableProps } from "./PivotTable";

export interface WrapperProps extends Omit<PivotTableProps, "dataModel"> {
  model: Model;
  pvData: Data;
  pageInfo: PageInfo;
  qPivotDataPages: EngineAPI.INxPivotPage[];
  updatePageInfo: (args: Partial<PageInfo>) => void;
  translator: stardust.Translator;
}

export const Wrapper = (props: WrapperProps): JSX.Element => {
  const styleService = useStyleContext();
  const {
    model,
    translator,
    pageInfo,
    updatePageInfo,
    layoutService: { hasLimitedData },
    pvData: { newPageHandler, nextPageHandler },
  } = props;

  const dataModel: DataModel = useDataModel({
    model,
    newPageHandler,
    nextPageHandler,
    pageInfo,
  });

  return (
    <>
      <StickyPivotTable {...props} dataModel={dataModel} />
      {hasLimitedData && <Disclaimer styleService={styleService} translator={translator} />}
      {pageInfo.shouldShowPagination && (
        <Pagination pageInfo={pageInfo} updatePageInfo={updatePageInfo} dataModel={dataModel} />
      )}
    </>
  );
};
