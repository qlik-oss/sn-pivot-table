import * as nebula from "@nebula.js/stardust";
import useWaitForFonts from "../use-wait-for-fonts";

jest.mock("@nebula.js/stardust");

describe("useWaitForFonts", () => {
  let loadSpy: jest.SpyInstance<Promise<FontFace[]>, [font: string, text?: string | undefined], unknown>;

  beforeEach(() => {
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
    const usePromiseResult: Promise<void> = Promise.resolve();
    const usePromiseError: Error = new Error("test");
    const usePromiseMock = (callback: () => void): [Promise<void>, Error] => {
      callback();
      return [usePromiseResult, usePromiseError];
    };

    jest.spyOn(nebula, "usePromise").mockImplementation(usePromiseMock);

    const isFontLoaded = useWaitForFonts(["12px Arial", "600 12px Arial"]);

    expect(isFontLoaded).toBe(true);

    expect(loadSpy).toHaveBeenCalledWith("12px Arial");
    expect(loadSpy).toHaveBeenCalledWith("600 12px Arial");
  });
});
