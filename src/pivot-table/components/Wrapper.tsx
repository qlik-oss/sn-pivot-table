import React from "react";
import { useStyleContext } from "../contexts/StyleProvider";
import { Disclaimer } from "./Disclaimer";
import { PivotTableProps, StickyPivotTable } from "./PivotTable";

export const Wrapper = (props: PivotTableProps): JSX.Element => {
  const {
    layoutService: { hasLimitedData },
  } = props;
  const styleService = useStyleContext();

  return (
    <>
      <StickyPivotTable {...props} />
      {hasLimitedData && <Disclaimer styleService={styleService} />}
    </>
  );
};
