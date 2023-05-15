import type { stardust } from "@nebula.js/stardust";
import { useEffect, useState } from "@nebula.js/stardust";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import type { LayoutService, PageInfo } from "../types/types";

interface UsePagination {
  (layoutService: LayoutService): {
    pageInfo: PageInfo;
    setPageInfo: stardust.SetStateFn<PageInfo>;
  };
}

const getPageMeta = (qcy: number) => {
  const rowsPerPage = Math.min(qcy, MAX_ROW_COUNT);
  const totalPages = Math.ceil(qcy / rowsPerPage);
  const totalRowCount = qcy;

  return { rowsPerPage, totalPages, totalRowCount };
};

const usePagination: UsePagination = (layoutService) => {
  const {
    size,
    layout: {
      qHyperCube: { qSize },
    },
  } = layoutService;

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    shouldShowPagination: qSize.qcy > size.y,
    ...getPageMeta(qSize.qcy),
  });

  useEffect(() => {
    setPageInfo((prev) => ({
      ...prev,
      ...getPageMeta(layoutService.layout.qHyperCube.qSize.qcy),
    }));
  }, [layoutService.layout.qHyperCube.qSize.qcy, setPageInfo]);

  return {
    pageInfo,
    setPageInfo,
  };
};

export default usePagination;
