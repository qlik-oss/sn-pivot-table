import type { PivotLayout } from "../../../../types/QIX";
import type { ViewService } from "../../../../types/types";

const getViewState = (layout: PivotLayout, viewService: ViewService, element: HTMLElement) => {
  const tableBody = element.querySelector('.qv-object-sn-pivot-table [data-key="scrollable-container--leftGrid"]');
  console.log("🚀 ~ getViewState ~ tableBody:", tableBody);

  if (viewService.viewState) return viewService.viewState;
  return {
    scrollLeft: viewService.scrollLeft,
    visibleLeft: viewService.visibleLeft,
    visibleWidth: viewService.visibleWidth,
    visibleTop: 5,
    visibleHeight: 0,
    // visibleTop: visibleRowStartIndex,
    // visibleHeight: getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService),
    scrollTopRatio: viewService.scrollTopRatio,
    page: viewService.page,
  };
};

export default getViewState;
