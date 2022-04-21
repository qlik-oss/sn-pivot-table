import { useCallback, useMemo, useRef } from 'react';
import { memoize } from 'qlik-chart-modules';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = 'M';

const LEEWAY_WIDTH = 25; // Used to make sure there is some leeway in the measurement of a text

export default function useMeasureText(fontSize: string, fontFamily: string): MeasureTextHook {
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useMemo(() => {
    if (context.current === null) {
      context.current = document.createElement('canvas').getContext('2d');
    }
  }, [context.current]);

  useMemo(() => {
    if (context.current === null) return;

    context.current.font = `${fontSize} ${fontFamily}`;
  }, [context.current, fontSize, fontFamily]);

  const memoizedMeasureText = useMemo<(t: string) => ({ width: number })>(() => {
    if (context.current === null) return null;

    return memoize(context.current.measureText.bind(context.current));
  }, [context.current]);

  const estimateWidth = useCallback((length: number) => {
    if (context.current === null || memoizedMeasureText === null) return 0;

    return memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length;
  }, [context.current, memoizedMeasureText]);

  const measureText = useCallback((text: string) => {
    if (context.current === null || memoizedMeasureText === null) return 0;

    return memoizedMeasureText(text).width + LEEWAY_WIDTH;
  }, [context.current, memoizedMeasureText]);

  return { estimateWidth, measureText };
}
