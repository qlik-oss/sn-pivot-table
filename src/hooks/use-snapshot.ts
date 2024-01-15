/* eslint-disable no-param-reassign */
import { onTakeSnapshot, useImperativeHandle, type stardust } from "@nebula.js/stardust";
import { Q_PATH } from "../constants";
import { getViewState } from "../pivot-table/components/cells/utils/get-view-state";
import type { Model, SnapshotLayout } from "../types/QIX";
import type { LayoutService, ViewService } from "../types/types";

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  rect: stardust.Rect;
  model: Model;
}

const useSnapshot = ({ layoutService, viewService, rect, model }: UseSnapshotProps): stardust.Rect => {
  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData || !model || snapshotLayout.snapshotData.content) {
      return snapshotLayout;
    }

    const { rowPartialHeight, visibleTopIndex, visibleRows, page, rowsPerPage } = getViewState(viewService);
    if ((model as EngineAPI.IGenericObject)?.getHyperCubePivotData) {
      snapshotLayout.snapshotData.content = {
        qPivotDataPages: await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [
          {
            qLeft: viewService.gridColumnStartIndex,
            qTop: viewService.gridRowStartIndex,
            qWidth: viewService.gridWidth,
            qHeight: viewService.gridHeight,
          },
        ]),
        rowPartialHeight,
        visibleTopIndex,
        visibleRows,
        page,
        rowsPerPage,
      };

      snapshotLayout.snapshotData.object.size.w = rect.width;
      snapshotLayout.snapshotData.object.size.h = rect.height;
    }
    return snapshotLayout;
  });

  useImperativeHandle(() => ({ getViewState: () => getViewState(viewService) }), [viewService]);

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
