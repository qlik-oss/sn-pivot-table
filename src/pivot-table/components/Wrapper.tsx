import type { stardust } from "@nebula.js/stardust";
import React from "react";
import { useStyleContext } from "../contexts/StyleProvider";
import { Disclaimer } from "./Disclaimer";
import { StickyPivotTable, type PivotTableProps } from "./PivotTable";

export interface WrapperProps extends PivotTableProps {
  translator: stardust.Translator;
}

export const Wrapper = (props: WrapperProps): JSX.Element => {
  const {
    layoutService: { hasLimitedData },
    translator,
  } = props;
  const styleService = useStyleContext();

  return (
    <>
      <StickyPivotTable {...props} />
      {hasLimitedData && <Disclaimer styleService={styleService} translator={translator} />}
    </>
  );
};
