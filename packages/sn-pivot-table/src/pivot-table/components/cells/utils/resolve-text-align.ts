import { CLIENT_IM_5863_PVT_TEXT_ALIGN } from "../../../../constants/flags";
import type { TextAlign } from "../../../../types/QIX";
import type { Flags } from "../../../../types/types";

const resolveTextAlign = (textAlign: TextAlign | undefined, defaultValue: string | undefined, flags: Flags) => {
  if (!flags.isEnabled(CLIENT_IM_5863_PVT_TEXT_ALIGN) || textAlign?.auto) {
    return defaultValue;
  }

  switch (textAlign?.align) {
    case "center":
      return "center";
    case "left":
      return "flex-start";
    case "right":
      return "flex-end";
    default:
      return defaultValue;
  }
};

export default resolveTextAlign;
