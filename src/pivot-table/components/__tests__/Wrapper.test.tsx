import { render, screen } from "@testing-library/react";
import React from "react";
import type { ExtendedTranslator, LayoutService, PageInfo } from "../../../types/types";
import { TestWithProvider } from "../../__tests__/test-with-providers";
import { StickyPivotTable } from "../PivotTable";
import type { WrapperProps } from "../Wrapper";
import { Wrapper } from "../Wrapper";

jest.mock("../PivotTable");

describe("Wrapper", () => {
  const disclaimerText = "* Currently showing limited number of columns";
  const mockedPivotTable = StickyPivotTable as jest.MockedFunction<typeof StickyPivotTable>;
  mockedPivotTable.mockReturnValue(<div />);
  let layoutService: LayoutService;
  let translator: ExtendedTranslator;
  let pageInfo: PageInfo;

  beforeEach(() => {
    layoutService = {
      hasLimitedData: false,
    } as LayoutService;
    translator = {
      get: () => disclaimerText,
    } as unknown as ExtendedTranslator;
    pageInfo = {
      shouldShowPagination: false,
    } as PageInfo;
  });

  test("should render with a disclaimer", () => {
    layoutService.hasLimitedData = true;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo } as unknown as WrapperProps)} />
      </TestWithProvider>
    );
    expect(screen.getByText(disclaimerText)).toBeVisible();
  });

  test("should render without a disclaimer", () => {
    layoutService.hasLimitedData = false;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo } as unknown as WrapperProps)} />
      </TestWithProvider>
    );
    expect(screen.queryByText(disclaimerText)).toBeNull();
  });
});
