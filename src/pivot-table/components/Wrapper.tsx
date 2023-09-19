import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { PageInfo } from "../../types/types";
import { useStyleContext } from "../contexts/StyleProvider";
import Disclaimer from "./Disclaimer";
import Pagination from "./Pagination";
import { StickyPivotTable, type PivotTableProps } from "./PivotTable";

export interface WrapperProps extends PivotTableProps {
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
}

export const Wrapper = (props: WrapperProps) => {
  const {
    layoutService: { hasLimitedData },
    translator,
    pageInfo,
    updatePageInfo,
  } = props;
  const styleService = useStyleContext();

  return (
    <>
      <StickyPivotTable {...props} />
      {hasLimitedData && <Disclaimer styleService={styleService} translator={translator} />}
      {pageInfo.shouldShowPagination && <Pagination pageInfo={pageInfo} updatePageInfo={updatePageInfo} />}
    </>
  );
};
