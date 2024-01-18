/* eslint-disable no-param-reassign */
import { onTakeSnapshot, useImperativeHandle, type stardust } from "@nebula.js/stardust";
import { Q_PATH } from "../constants";
import getViewState from "../pivot-table/components/cells/utils/get-view-state";
import type { Model, SnapshotLayout } from "../types/QIX";
import type { LayoutService, ViewService } from "../types/types";

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  rect: stardust.Rect;
  model: Model;
  element: HTMLElement;
}

const useSnapshot = ({ layoutService, viewService, rect, model, element }: UseSnapshotProps): stardust.Rect => {
  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData || !model || snapshotLayout.snapshotData.content) {
      return snapshotLayout;
    }

    if ((model as EngineAPI.IGenericObject)?.getHyperCubePivotData) {
      const { scrollLeft, scrollTopRatio, visibleLeft, visibleWidth, visibleTop, visibleHeight, page } = getViewState(
        layoutService.layout,
        viewService,
        element,
      );
      const pivotPages = await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [
        {
          qLeft: viewService.gridColumnStartIndex,
          qTop: viewService.gridRowStartIndex,
          qWidth: viewService.gridWidth,
          qHeight: viewService.gridHeight,
        },
      ]);

      snapshotLayout.snapshotData.content = {
        qPivotDataPages: pivotPages,
        // rowPartialHeight,
        scrollLeft,
        scrollTopRatio,
        visibleLeft,
        visibleWidth,
        visibleTop,
        visibleHeight,
        page,
      };
    }

    snapshotLayout.snapshotData.object.size.w = rect.width;
    snapshotLayout.snapshotData.object.size.h = rect.height;

    return snapshotLayout;
  });

  useImperativeHandle(
    () => ({
      getViewState: () => getViewState(layoutService.layout, viewService, element),
    }),
    [layoutService.layout, viewService, element],
  );

  if (layoutService.layout.snapshotData?.content) {
    return {
      left: rect.left,
      top: rect.top,
      width: layoutService.layout.snapshotData.object.size.w,
      height: layoutService.layout.snapshotData.object.size.h,
    };
  }

  return rect;
};

export default useSnapshot;
