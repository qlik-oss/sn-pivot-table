import { ScrollDirection } from "../../../../types/types";

const getBackBuffer = (dir: React.MutableRefObject<ScrollDirection>, buffer: number) =>
  dir.current === ScrollDirection.Backward ? buffer : 0;

export default getBackBuffer;
