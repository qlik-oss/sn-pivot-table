/* eslint-disable no-param-reassign */
import { onTakeSnapshot, useImperativeHandle, type stardust } from "@nebula.js/stardust";
import { Q_PATH } from "../constants";
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
      };
    }

    snapshotLayout.snapshotData.object.size.w = rect.width;
    snapshotLayout.snapshotData.object.size.h = rect.height;

    return snapshotLayout;
  });

  if (layoutService.layout.snapshotData?.content) {
    return {
      left: rect.left,
      top: rect.top,
      width: layoutService.layout.snapshotData.object.size.w,
      height: layoutService.layout.snapshotData.object.size.h,
    };
  }

  useImperativeHandle(
    () => ({ getViewState: () => getViewState(layoutService, viewService, element) }),
    [layoutService, viewService, element],
  );

  return rect;
};

export default useSnapshot;
