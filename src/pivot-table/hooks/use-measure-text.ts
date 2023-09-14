import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo, useRef } from "react";

type MeasureText = (text: string) => TextMetrics;

export interface MeasureTextStyling {
  fontSize: string;
  fontFamily: string;
}

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = "M";

// const LEEWAY_WIDTH = 25; // Used to make sure there is some leeway in the measurement of a text
const LEEWAY_WIDTH = 0;

export default function useMeasureText({ fontSize, fontFamily }: MeasureTextStyling): MeasureTextHook {
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useMemo(() => {
    if (context.current === null) {
      context.current = document.createElement("canvas").getContext("2d");
    }
  }, []);

  useMemo(() => {
    if (context.current === null) return;

    context.current.font = `${fontSize} ${fontFamily}`;
  }, [fontSize, fontFamily]);

  const memoizedMeasureText = useMemo<MeasureText | null>(() => {
    if (context.current === null) return null;

    return memoize<MeasureText>(context.current.measureText.bind(context.current));
  }, []);

  const estimateWidth = useCallback(
    (length: number) => {
      if (context.current === null || memoizedMeasureText === null) return 0;

      return memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length;
    },
    [memoizedMeasureText],
  );

  const measureText = useCallback(
    (text: string) => {
      if (context.current === null || memoizedMeasureText === null) return 0;
      // console.log(text, memoizedMeasureText(text).width, memoizedMeasureText(text).width + LEEWAY_WIDTH);
      return memoizedMeasureText(text).width + LEEWAY_WIDTH;
    },
    [memoizedMeasureText],
  );

  return { estimateWidth, measureText };
}
