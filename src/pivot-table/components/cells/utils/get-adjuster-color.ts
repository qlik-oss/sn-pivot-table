import { color } from "d3-color";

export default function getAdjusterColor(backgroundColorString: string, borderColorString: string) {
  const opaqueBackground = backgroundColorString === "transparent" ? "#ffffff" : backgroundColorString;
  const borderColor = color(borderColorString)?.rgb();
  const backgroundColor = color(opaqueBackground)?.rgb();
  let blendedColor = null;

  if (borderColor?.opacity !== undefined && backgroundColor) {
    blendedColor = {
      // weighted mean of the components
      r: borderColor.opacity * borderColor.r + backgroundColor.r * (1 - borderColor.opacity),
      g: borderColor.opacity * borderColor.g + backgroundColor.g * (1 - borderColor.opacity),
      b: borderColor.opacity * borderColor.b + backgroundColor.b * (1 - borderColor.opacity),
    };

    return `rgb(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b})`;
  }

  return borderColorString;
}
