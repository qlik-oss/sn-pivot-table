import { rgb } from "d3-color";

const ARGB_REGEX = /^argb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;

const toRGB = (color: string) => {
  const matches = ARGB_REGEX.exec(color);

  if (matches) {
    const [, r, g, b, a] = matches;
    return rgb(+r, +g, +b, +a).toString();
  }

  return rgb(color).toString();
};

export default toRGB;
