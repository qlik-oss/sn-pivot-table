import type { ListItemData } from "../../../types/types";

const getItemKey = (index: number, data: ListItemData): string => `${data.list[index]?.ref.qElemNo}-${index}`;

export default getItemKey;
