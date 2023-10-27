import { COLUMN_ADJUSTER_CLASS } from "../styles";

const isEventFromColumnAdjuster = (evt: React.MouseEvent) =>
  (evt.target as HTMLElement | SVGElement)?.getAttribute("class")?.includes(COLUMN_ADJUSTER_CLASS);

export default isEventFromColumnAdjuster;
