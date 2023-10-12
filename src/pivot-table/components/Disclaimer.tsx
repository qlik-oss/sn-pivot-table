import type { stardust } from "@nebula.js/stardust";
import React from "react";
import { DEFAULT_FONT_FAMILY, DISCLAIMER_HEIGHT } from "../constants";
import { useBaseContext } from "../contexts/BaseProvider";
import { textStyle } from "./shared-styles";

interface DisclaimerProps {
  translator: stardust.Translator;
}

const Disclaimer = ({ translator }: DisclaimerProps): JSX.Element => {
  const text = translator.get("SNPivotTable.LimitedData");
  const { theme } = useBaseContext();
  const fontFamily = theme.getStyle("", "", "fontFamily") ?? DEFAULT_FONT_FAMILY;

  return (
    <div style={{ width: "100%", height: `${DISCLAIMER_HEIGHT}px` }}>
      <span
        style={{
          ...textStyle,
          fontFamily,
          fontSize: "13px",
          fontStyle: "italic",
          lineHeight: `${DISCLAIMER_HEIGHT}px`,
          color: "#7b7a78",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default Disclaimer;
