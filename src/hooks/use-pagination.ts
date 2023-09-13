import { useEffect, useState } from "@nebula.js/stardust";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import type { LayoutService, PageInfo } from "../types/types";

interface UpdatePageInfo {
  (args: Partial<PageInfo>): void;
}

interface UsePagination {
  (layoutService: LayoutService): {
    pageInfo: PageInfo;
    updatePageInfo: UpdatePageInfo;
  };
}

const getRowsOnCurrentPage = ({ rowsPerPage, totalRowCount, currentPage }: PageInfo) =>
  Math.min(rowsPerPage, totalRowCount - currentPage * rowsPerPage);

const getPageMeta = (qcy: number) => {
  const rowsPerPage = Math.min(qcy, MAX_ROW_COUNT);
  const totalPages = Math.ceil(qcy / rowsPerPage);
  const totalRowCount = qcy;
  const rowsOnCurrentPage = getRowsOnCurrentPage({ rowsPerPage, totalRowCount, currentPage: 0 } as PageInfo);

  return { rowsPerPage, totalPages, totalRowCount, rowsOnCurrentPage };
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
    setPageInfo((prev) => {
      const newPageMeta = getPageMeta(layoutService.layout.qHyperCube.qSize.qcy);
      const rowsOnCurrentPage = getRowsOnCurrentPage({ ...prev, ...newPageMeta });

      return {
        ...prev,
        ...newPageMeta,
        rowsOnCurrentPage,
        shouldShowPagination: layoutService.layout.qHyperCube.qSize.qcy > layoutService.size.y,
      };
    });
  }, [layoutService.layout.qHyperCube.qSize.qcy, layoutService.size.y, setPageInfo]);

  useEffect(() => {
    const { currentPage, totalPages } = pageInfo;
    // currPage is base 0 and totalPages always includes remainder rows in last page
    // so we need to consider both of them for prevent landing in missing page
    if (currentPage + 1 > totalPages) {
      const newCurrentPage = totalPages - 1;
      const rowsOnCurrentPage = getRowsOnCurrentPage({ ...pageInfo, currentPage: newCurrentPage });
      setPageInfo({ ...pageInfo, currentPage: newCurrentPage, rowsOnCurrentPage });
    }
  }, [pageInfo]);

  const updatePageInfo: UpdatePageInfo = (args) =>
    setPageInfo({ ...pageInfo, ...args, rowsOnCurrentPage: getRowsOnCurrentPage({ ...pageInfo, ...args }) });

  return {
    pageInfo,
    updatePageInfo,
  };
};

export default usePagination;
