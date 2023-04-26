import { usePromise } from "@nebula.js/stardust";

const useWaitForFonts = (fonts: string[]) => {
  const [isFontLoaded, error] = usePromise(() => Promise.all(fonts.map((font) => document.fonts.load(font))), [fonts]);

  // An error while loading fonts should not block the table from rendering. So if an error occur,
  // log the error and continue rendering
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load font:", error);
    return true;
  }

  return !!isFontLoaded;
};

export default useWaitForFonts;
