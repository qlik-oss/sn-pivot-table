import NxDimCellType from '../../../types/QIX';
import { ListItemData } from '../../../types/types';

const getItemKey = (index: number, data: ListItemData): string => {
  const { qElemNo, qType } = data.list[index];

  if (qElemNo < 0) {
    return `${qElemNo}-${index}`;
  }

  if (qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
    return `${NxDimCellType.NX_DIM_CELL_PSEUDO}-${index}`;
  };

  return qElemNo.toString();
};

export default getItemKey;
