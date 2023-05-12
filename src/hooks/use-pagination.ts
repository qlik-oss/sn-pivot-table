import type { stardust } from "@nebula.js/stardust";
import { useState } from "@nebula.js/stardust";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import type { LayoutService, PageInfo } from "../types/types";

interface UsePagination {
  (layoutService: LayoutService): {
    pageInfo: PageInfo;
    setPageInfo: stardust.SetStateFn<PageInfo>;
  };
}

const usePagination: UsePagination = (layoutService) => {
  const {
    size,
    layout: {
      qHyperCube: { qSize },
    },
  } = layoutService;
  const rowsPerPage = Math.min(qSize.qcy, MAX_ROW_COUNT);
  const totalPages = Math.ceil(qSize.qcy / rowsPerPage);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    shouldShowPagination: qSize.qcy > size.y,
    totalPages,
    rowsPerPage,
    totalRowCount: qSize.qcy,
  });

  return {
    pageInfo,
    setPageInfo,
  };
};

export default usePagination;
