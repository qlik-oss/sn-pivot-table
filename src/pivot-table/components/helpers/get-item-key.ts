import { ListItemData } from '../../../types/types';

const getItemKey = (index: number, data: ListItemData): string => `${data.list[index].qElemNo}-${index}`;

export default getItemKey;
