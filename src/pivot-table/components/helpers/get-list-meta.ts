import { List } from "../../../types/types";

const getListMeta = (list: List, totalSize: number, qSize: number, isLast: boolean) => {
  let itemCount = Object.keys(list).length;
  let estimatedItemSize;
  if (isLast) {
    itemCount = qSize;
    // Only need estimated size for the last list, as it does not already contain all the values
    estimatedItemSize = totalSize / itemCount;
  }

  return {
    itemCount,
    estimatedItemSize,
  };
};

export default getListMeta;
