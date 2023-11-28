import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useLayoutEffect } from "react";
import type { VariableSizeList } from "react-window";
import type { DataModel, LeftDimensionData, TopDimensionData } from "../../types/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Refs = React.RefObject<(VariableSizeList<any> | null)[]>;

export const useResetListCacheAndRerender = (refs: Refs, width: number, height: number, contentHeight: number) => {
  useLayoutEffect(() => {
    refs.current?.forEach((list) => list?.resetAfterIndex(0, true));
  }, [refs, width, height, contentHeight]);
};

export const useResetListCache = (refs: Refs, dataModel: DataModel, data: LeftDimensionData | TopDimensionData) => {
  useOnPropsChange(() => {
    refs.current?.forEach((list) => list?.resetAfterIndex(0, false));
  }, [refs, dataModel, data]);
};
