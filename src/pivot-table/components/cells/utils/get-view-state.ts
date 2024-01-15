import type { ViewService } from "../../../../types/types";

export const getViewState = (viewService: ViewService) => {
  if (viewService.viewState) return viewService.viewState;
  return {
    rowPartialHeight: 125,
    visibleTopIndex: 5,
    visibleRows: 16,
    page: 0,
    rowsPerPage: 0,
  };
};
