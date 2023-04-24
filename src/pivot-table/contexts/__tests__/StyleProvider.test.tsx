import { render } from "@testing-library/react";
import React from "react";
import { LayoutService, StyleService } from "../../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../../constants";
import StyleProvider, { useStyleContext } from "../StyleProvider";

const DummyTestComponent = () => {
  const { cellHeight, lineClamp } = useStyleContext();

  return (
    <div>
      <p data-testid="cell-height">{cellHeight}</p>
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

  describe("assert `rowHeight.linesCount` effect", () => {
    beforeEach(() => {
      layoutService = {
        layout: {
          components: [{ key: "theme" }],
        },
      } as LayoutService;
    });

    test("should return default values", () => {
      const { getByTestId } = renderer();
      expect(getByTestId("cell-height").textContent).toEqual(`${DEFAULT_ROW_HEIGHT}`);
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
      expect(getByTestId("cell-height").textContent).toEqual(`${n * DEFAULT_ROW_HEIGHT}`);
      expect(getByTestId("line-clamp").textContent).toEqual(`${n}`);
    });
  });
});
