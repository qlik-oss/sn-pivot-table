import { useCallback, useMemo, useRef } from 'react';

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

  const estimateWidth = useCallback((length: number) => {
    if (context.current === null) return 0;

    return Math.max(context.current.measureText(MAGIC_DEFAULT_CHAR).width * length, 100);
  }, [context.current]);

  const measureText = useCallback((text: string) => {
    if (context.current === null) return 0;

    return context.current.measureText(text).width + LEEWAY_WIDTH;
  }, [context.current]);

  return { estimateWidth, measureText };
}
