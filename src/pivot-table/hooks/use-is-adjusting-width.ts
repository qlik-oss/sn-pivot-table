import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useState } from "react";

const useIsAdjustingWidth = (deps: unknown[]) => {
  const [isAdjustingWidth, setIsAdjustingWidth] = useState(false);

  useOnPropsChange(() => {
    setIsAdjustingWidth(false);
  }, deps);

  return { isAdjustingWidth, setIsAdjustingWidth };
};

export default useIsAdjustingWidth;
