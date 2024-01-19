declare module "qlik-chart-modules" {
  type SetValue = (propTree: unknown, path: string, value: unknown) => void;
  type Memoize = <T>(callback: T) => T;
  type Debouncer = <T>(callback: T, timeout?: number) => T;
  type Throttler = <T>(callback: T, timeout?: number) => T;
  type GetAvailableFonts = (flags: { isEnabled: (flag: string) => boolean }) => string[];

  export const setValue: SetValue;
  export const memoize: Memoize;
  export const debouncer: Debouncer;
  export const throttler: Throttler;
  export const getAvailableFonts: GetAvailableFonts;
}
