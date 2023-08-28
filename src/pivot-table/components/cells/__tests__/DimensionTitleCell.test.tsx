import type { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { HeaderTitle } from "../../../../types/types";
import DimensionTitleCell, { testId } from "../DimensionTitleCell";

jest.mock("../../../contexts/StyleProvider");

test("should render", () => {
  const cell = { title: "test value" } as HeaderTitle;
  const translator = { get: (s) => s } as stardust.Translator;
  const changeSortOrder = jest.fn();
  const changeActivelySortedColumn = jest.fn();

  const style: React.CSSProperties = {
    position: "relative",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell
      cell={cell}
      translator={translator}
      style={style}
      isLastColumn={false}
      changeSortOrder={changeSortOrder}
      changeActivelySortedHeader={changeActivelySortedColumn}
    />,
  );

  expect(screen.getByText(cell.title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});
