import { VariableSizeList } from "react-window";

const setRef =
  (refList: React.RefObject<VariableSizeList[]>, colIndex: number) =>
  (ref: VariableSizeList): void => {
    if (refList.current) {
      refList.current[colIndex] = ref; // eslint-disable-line no-param-reassign
    }
  };

export default setRef;
