import type { List } from "../../../types/types";

const getListMeta = (list: List, totalSize: number, qSize: number, isLast: boolean) => {
  const listValues = Object.values(list);
  let itemCount = listValues.length;
  let estimatedItemSize;
  if (isLast) {
    itemCount = qSize;
    // Only need estimated size for the last list, as it does not already contain all the values
    estimatedItemSize = totalSize / itemCount;
  }

  return {
    itemCount,
    estimatedItemSize,
    listValues,
  };
};

export default getListMeta;
