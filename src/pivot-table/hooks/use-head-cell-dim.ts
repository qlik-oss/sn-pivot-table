import type { stardust } from "@nebula.js/stardust";
import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useState } from "react";
import type { DataModel } from "../../types/types";
import isEventFromColumnAdjuster from "../components/cells/utils/is-event-from-column-adjuster";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
  dataModel: DataModel;
}

export const useHeadCellDim = ({ interactions, dataModel }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);
  const [isAdjustingWidth, setIsAdjustingWidth] = useState(false);

  // dataModel is only needed here since we want to reset isAdjustingWidth whenever there is a layout change
  useOnPropsChange(() => {
    console.log("useonprops");
    setIsAdjustingWidth(false);
  }, [dataModel]);

  const handleOpenMenu = (evt: React.MouseEvent) =>
    interactions.active && !isEventFromColumnAdjuster(evt) && !isAdjustingWidth && setOpen(true);

  return { open, setOpen, handleOpenMenu, setIsAdjustingWidth };
};
