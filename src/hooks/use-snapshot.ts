/* eslint-disable no-param-reassign */
import { onTakeSnapshot, stardust } from '@nebula.js/stardust';
import { SnapshotData, SnapshotLayout } from '../types/QIX';
import { LayoutService, ViewService } from '../types/types';

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  rect: stardust.Rect;
}

const useSnapshot = ({
  layoutService,
  viewService,
  rect
}: UseSnapshotProps): stardust.Rect => {
  onTakeSnapshot(async (copyOfLayout: SnapshotLayout) => {
    console.debug('onTakeSnapshot', {...copyOfLayout});

    if (!copyOfLayout.snapshotData) {
      return copyOfLayout;
    }

    if (!copyOfLayout.snapshotData.content) {
      copyOfLayout.snapshotData.content = {
        viewState: { ...viewService }
      };

      copyOfLayout.snapshotData.object.size.w = rect.width;
      copyOfLayout.snapshotData.object.size.h = rect.height;

      console.debug('copyOfLayout', copyOfLayout);

      return copyOfLayout;
    }

    console.debug('data have already been set');
    return copyOfLayout;
  });

  if (layoutService.layout.snapshotData?.content) {
    console.debug('using snapshot size', layoutService.layout.snapshotData.object.size);
    return {
      left: rect.left,
      top: rect.top,
      width: layoutService.layout.snapshotData.object.size.w,
      height: layoutService.layout.snapshotData.object.size.h,
    };
  }
  console.debug('using normal size');
  return rect;
};

export default useSnapshot;
