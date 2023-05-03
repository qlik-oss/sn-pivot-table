/* eslint-disable no-param-reassign */
import { onTakeSnapshot, type stardust } from "@nebula.js/stardust";
import { Q_PATH } from "../constants";
import type { Model, SnapshotLayout } from "../types/QIX";
import type { LayoutService, ViewService } from "../types/types";

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  rect: stardust.Rect;
  model: Model;
}

const useSnapshot = ({ layoutService, viewService, rect, model }: UseSnapshotProps): stardust.Rect => {
  onTakeSnapshot(async (copyOfLayout: SnapshotLayout) => {
    if (!copyOfLayout.snapshotData) {
      return copyOfLayout;
    }

    if (!model) {
      return copyOfLayout;
    }

    if (!copyOfLayout.snapshotData.content) {
      if ((model as EngineAPI.IGenericObject)?.getHyperCubePivotData) {
        const pivotPages = await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [
          {
            qLeft: viewService.gridColumnStartIndex,
            qTop: viewService.gridRowStartIndex,
            qWidth: viewService.gridWidth,
            qHeight: viewService.gridHeight,
          },
        ]);

        copyOfLayout.snapshotData.content = {
          qPivotDataPages: pivotPages,
        };
      }

      copyOfLayout.snapshotData.object.size.w = rect.width;
      copyOfLayout.snapshotData.object.size.h = rect.height;

      return copyOfLayout;
    }

    return copyOfLayout;
  });

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
