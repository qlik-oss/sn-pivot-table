import React, { type ReactNode } from "react";
import useDisclaimer, { type DisclaimerProps } from "../hooks/use-disclaimer";
import { textStyle } from "./shared-styles";

const Disclaimer = (props: DisclaimerProps): ReactNode => {
  const { text, fontFamily, fontSize, justifyContent, alignItems, height } = useDisclaimer(props);

  if (text === undefined) {
    return null;
  }

  return (
    <div style={{ display: "flex", justifyContent, alignItems, width: "100%", height }}>
      <span
        style={{
          ...textStyle,
          fontFamily,
          fontSize,
          fontStyle: "italic",
          color: "#7b7a78",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default Disclaimer;
