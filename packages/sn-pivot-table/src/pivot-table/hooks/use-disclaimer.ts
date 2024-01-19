import type { stardust } from "@nebula.js/stardust";
import type { LayoutService } from "../../types/types";
import { DEFAULT_FONT_FAMILY, DISCLAIMER_HEIGHT } from "../constants";
import { useBaseContext } from "../contexts/BaseProvider";

export interface DisclaimerProps {
  translator: stardust.Translator;
  layoutService: LayoutService;
}

const useDisclaimer = ({ translator, layoutService }: DisclaimerProps) => {
  const { theme } = useBaseContext();
  const fontFamily = theme.getStyle("", "", "fontFamily") ?? DEFAULT_FONT_FAMILY;

  if (!layoutService.hasData) {
    return {
      text: translator.get("SNPivotTable.NoData"),
      fontSize: "16px",
      fontFamily,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    };
  }

  if (layoutService.hasLimitedData) {
    return {
      text: translator.get("SNPivotTable.LimitedData"),
      fontSize: "13px",
      fontFamily,
      alignItems: "center",
      height: `${DISCLAIMER_HEIGHT}px`,
    };
  }

  return {};
};

export default useDisclaimer;
