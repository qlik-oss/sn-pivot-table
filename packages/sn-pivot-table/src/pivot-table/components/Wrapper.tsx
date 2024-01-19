import type { stardust } from "@nebula.js/stardust";
import { PaginationFooter } from "@qlik/nebula-table-utils/lib/components";
import React from "react";
import type { PageInfo, Rect } from "../../types/types";
import { useBaseContext } from "../contexts/BaseProvider";
import Disclaimer from "./Disclaimer";
import { StickyPivotTable, type PivotTableProps } from "./PivotTable";

export interface WrapperProps extends PivotTableProps {
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
  rect: Rect;
}

export const Wrapper = (props: WrapperProps) => {
  const { layoutService, translator, pageInfo, updatePageInfo, rect } = props;
  const { keyboard, theme, interactions } = useBaseContext();
  const { layout, hasData } = layoutService;

  return (
    <>
      {hasData && <StickyPivotTable {...props} />}
      <Disclaimer translator={translator} layoutService={layoutService} />
      <PaginationFooter
        paginationNeeded={pageInfo.shouldShowPagination}
        handleChangePage={(page) => updatePageInfo({ page })}
        pageInfo={pageInfo}
        totalRowCount={pageInfo.totalRowCount}
        totalColumnCount={0}
        totalPages={pageInfo.totalPages}
        keyboard={keyboard}
        translator={translator}
        theme={theme}
        interactions={interactions}
        rect={rect as stardust.Rect}
        layout={layout}
      />
    </>
  );
};
