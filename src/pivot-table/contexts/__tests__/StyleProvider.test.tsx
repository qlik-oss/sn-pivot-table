import { render } from "@testing-library/react";
import React from "react";
import { LayoutService, StyleService } from "../../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../../constants";
import StyleProvider, { useStyleContext } from "../StyleProvider";

const DummyTestComponent = () => {
  const { cellHeight } = useStyleContext();

  return (
    <div>
      <p data-testid="cell-height">{cellHeight}</p>
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

    test("should return default cell height", () => {
      const { getByTestId } = renderer();
      expect(getByTestId("cell-height").textContent).toEqual(`${DEFAULT_ROW_HEIGHT}`);
    });

    test("should return correct cell height for 'n' lines", () => {
      const n = 2;
      layoutService = {
        layout: {
          components: [{ key: "theme", rowHeight: { linesCount: n } }],
        },
      } as LayoutService;

      const { getByTestId } = renderer();
      expect(getByTestId("cell-height").textContent).toEqual(`${n * DEFAULT_ROW_HEIGHT}`);
    });
  });
});
