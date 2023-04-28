import { render, screen } from "@testing-library/react";
import React from "react";
import { ExtendedTranslator, LayoutService } from "../../../types/types";
import { TestWithProvider } from "../../__tests__/test-with-providers";
import { StickyPivotTable } from "../PivotTable";
import { Wrapper, WrapperProps } from "../Wrapper";

jest.mock("../PivotTable");

describe("Wrapper", () => {
  const disclaimerText = "Currently showing limited number of columns";
  const disclaimerTextWithAstrix = `* ${disclaimerText}`;
  const mockedPivotTable = StickyPivotTable as jest.MockedFunction<typeof StickyPivotTable>;
  mockedPivotTable.mockReturnValue(<div />);
  let layoutService: LayoutService;
  let translator: ExtendedTranslator;

  beforeEach(() => {
    layoutService = {
      hasLimitedData: false,
    } as LayoutService;
    translator = {
      get: () => disclaimerText,
    } as unknown as ExtendedTranslator;
  });

  test("should render with a disclaimer", () => {
    layoutService.hasLimitedData = true;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator } as unknown as WrapperProps)} />
      </TestWithProvider>
    );
    expect(screen.getByText(disclaimerTextWithAstrix)).toBeVisible();
  });

  test("should render without a disclaimer", () => {
    layoutService.hasLimitedData = false;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator } as unknown as WrapperProps)} />
      </TestWithProvider>
    );
    expect(screen.queryByText(disclaimerTextWithAstrix)).toBeNull();
  });
});
