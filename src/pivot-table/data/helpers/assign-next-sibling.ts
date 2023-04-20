import { Cell } from "../../../types/types";

const assignNextSibling = (data: Cell[][]) => {
  data.slice(0, -1).forEach((list) => {
    list.forEach((cell, index, cells) => {
      // eslint-disable-next-line no-param-reassign
      cell.nextSibling = cells[index + 1] ?? null;
    });
  });
};

export default assignNextSibling;
