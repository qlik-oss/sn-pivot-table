// import { SnapshotLayout, SnapshotData } from './../types/QIX';
import type { PivotLayout } from "../types/QIX";
import type { ViewService, ViewState } from "../types/types";

const createViewService = (viewState: ViewState, layout: PivotLayout): ViewService => ({
  gridColumnStartIndex: 0,
  gridRowStartIndex: 0,
  gridWidth: 0,
  gridHeight: 0,
  qTop: 0,
  qHeight: 0,
  scrollLeft: 0,
  visibleTop: 123,
  visibleHeight: 15,
  visibleLeft: 0,
  visibleWidth: 2,
  // scrollTopRatio: 0.05,
  // TODO: rename these variables
  // visibleTop: layout.snapshotData?.content?.visibleTop ?? viewState?.visibleTop,
  // visibleHeight: layout.snapshotData?.content?.visibleHeight ?? viewState?.visibleHeight,
  // scrollLeft: layout.snapshotData?.content?.scrollLeft ?? viewState?.scrollLeft ?? 0,
  // scrollTopRatio: layout.snapshotData?.content?.scrollTopRatio ?? viewState?.scrollTopRatio,
  // page: layout.snapshotData?.content?.page ?? viewState?.page,
  viewState,
});

export default createViewService;
