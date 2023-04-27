import { render } from "@testing-library/react";
import React from "react";
import { LayoutService, StyleService } from "../../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../../constants";
import StyleProvider, { useStyleContext } from "../StyleProvider";

const DummyTestComponent = () => {
  const { headerCellHeight, contentCellHeight, lineClamp } = useStyleContext();

  return (
    <div>
      <p data-testid="header-cell-height">{headerCellHeight}</p>
      <p data-testid="content-cell-height">{contentCellHeight}</p>
      <p data-testid="line-clamp">{lineClamp}</p>
    </div>
  );
};

describe("StyleProvider", () => {
  let styleService: StyleService;
  let layoutService: LayoutService;

  const renderer = () =>
    render(
      <StyleProvider {...{ layoutService, styleService }}>
        <DummyTestComponent />
      </StyleProvider>
    );

  // formula:
  // given fontsize * coefficient (most adaptive one) * clamp count + padding of 8px
  const fontSizeCalcualteHelper = (size: string, clamp: number): string =>
    `${+(parseInt(size, 10) * (4 / 3) * clamp + 8).toFixed(2)}`;

  describe("assert `rowHeight.linesCount` effect", () => {
    beforeEach(() => {
      layoutService = {
        layout: { components: [{ key: "theme" }] },
      } as LayoutService;
      styleService = {
        header: { fontSize: "14px" },
        content: { fontSize: "12px" },
      } as unknown as StyleService;
    });

    test("should return default values because provided font sizes are smaller than `DEFAULT_ROW_HEIGHT`", () => {
      const { getByTestId } = renderer();
      expect(getByTestId("header-cell-height").textContent).toEqual(`${DEFAULT_ROW_HEIGHT}`);
      expect(getByTestId("content-cell-height").textContent).toEqual(`${DEFAULT_ROW_HEIGHT}`);
      expect(getByTestId("line-clamp").textContent).toEqual("1");
    });

    test("should return calculated values for 'n' lines", () => {
      const n = 2;
      layoutService = {
        layout: {
          components: [{ key: "theme", rowHeight: { linesCount: n } }],
        },
      } as LayoutService;

      const { getByTestId } = renderer();
      expect(getByTestId("header-cell-height").textContent).toEqual(
        fontSizeCalcualteHelper(styleService.header.fontSize, n)
      );
      expect(getByTestId("content-cell-height").textContent).toEqual(
        fontSizeCalcualteHelper(styleService.content.fontSize, n)
      );
      expect(getByTestId("line-clamp").textContent).toEqual(`${n}`);
    });
  });
});
