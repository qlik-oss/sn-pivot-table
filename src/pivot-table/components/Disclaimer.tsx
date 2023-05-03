import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { StyleService } from "../../types/types";
import { DISCLAIMER_HEIGHT } from "../constants";
import { textStyle } from "./shared-styles";

interface DisclaimerProps {
  styleService: StyleService;
  translator: stardust.Translator;
}

export const Disclaimer = ({ styleService, translator }: DisclaimerProps): JSX.Element => {
  const text = translator.get("SNPivotTable.LimitedData");
  const { fontFamily } = styleService.content; // TODO Resolve from root of theme?

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
