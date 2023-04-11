import { stardust } from "@nebula.js/stardust";
import createStyleService, {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from "../style-service";

describe("style service", () => {
  const mockedValue = "resolved value";
  let themeMock: stardust.Theme;

  beforeEach(() => {
    themeMock = {
      getStyle: () => mockedValue,
    } as unknown as stardust.Theme;
  });

  test("should resolve header style", () => {
    const styleService = createStyleService(themeMock);

    expect(styleService.header).toEqual({
      fontSize: mockedValue,
      fontFamily: mockedValue,
      color: mockedValue,
    });
  });

  test("should resolve default header style", () => {
    themeMock.getStyle = () => undefined;
    const styleService = createStyleService(themeMock);

    expect(styleService.header).toEqual({
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: DEFAULT_FONT_FAMILY,
      color: DEFAULT_TEXT_COLOR,
    });
  });

  test("should resolve content style", () => {
    const styleService = createStyleService(themeMock);

    expect(styleService.content).toEqual({
      fontSize: mockedValue,
      fontFamily: mockedValue,
      color: mockedValue,
    });
  });

  test("should resolve default content style", () => {
    themeMock.getStyle = () => undefined;
    const styleService = createStyleService(themeMock);

    expect(styleService.content).toEqual({
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: DEFAULT_FONT_FAMILY,
      color: DEFAULT_TEXT_COLOR,
    });
  });

  test("should resolve background color", () => {
    const styleService = createStyleService(themeMock);

    expect(styleService.backgroundColor).toEqual(mockedValue);
  });

  test("should resolve default background color", () => {
    themeMock.getStyle = () => undefined;
    const styleService = createStyleService(themeMock);

    expect(styleService.backgroundColor).toEqual(DEFAULT_BACKGROUND_COLOR);
  });
});
