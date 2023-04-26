import useWaitForFonts from "../use-wait-for-fonts";

let usePromiseResult: Promise<void> | undefined = Promise.resolve();
let usePromiseError: Error | undefined;

const usePromise = (callback: () => void) => {
  callback();
  return [usePromiseResult, usePromiseError];
};

jest.mock("@nebula.js/stardust", () => ({
  __esModule: true,
  usePromise,
}));

describe("useWaitForFonts", () => {
  let loadSpy: jest.SpyInstance<Promise<FontFace[]>, [font: string, text?: string | undefined], unknown>;

  beforeEach(() => {
    usePromiseResult = Promise.resolve();
    usePromiseError = undefined;
    loadSpy = jest.spyOn(global.document.fonts, "load");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should return true when fonts have been loaded", () => {
    const isFontLoaded = useWaitForFonts(["12px Arial", "600 12px Arial"]);

    expect(isFontLoaded).toBe(true);

    expect(loadSpy).toHaveBeenCalledWith("12px Arial");
    expect(loadSpy).toHaveBeenCalledWith("600 12px Arial");
  });

  test("should return true when an error occured", () => {
    usePromiseError = new Error("test");
    usePromiseResult = undefined;

    const isFontLoaded = useWaitForFonts(["12px Arial", "600 12px Arial"]);

    expect(isFontLoaded).toBe(true);

    expect(loadSpy).toHaveBeenCalledWith("12px Arial");
    expect(loadSpy).toHaveBeenCalledWith("600 12px Arial");
  });
});
