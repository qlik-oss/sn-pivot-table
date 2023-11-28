import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import type { VariableSizeList } from "react-window";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Refs = React.RefObject<(VariableSizeList<any> | null)[]>;

const useResetListCache = (refs: Refs, deps: unknown[]) => {
  useOnPropsChange(() => {
    refs.current?.forEach((list) => list?.resetAfterIndex(0, false));
  }, [refs, ...deps]);
};

export default useResetListCache;
