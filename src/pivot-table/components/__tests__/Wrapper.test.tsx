import { render, screen } from "@testing-library/react";
import React from "react";
import { LayoutService } from "../../../types/types";
import { TestWithProvider } from "../../__tests__/test-with-providers";
import { PivotTableProps, StickyPivotTable } from "../PivotTable";
import { Wrapper } from "../Wrapper";

jest.mock("../PivotTable");

describe("Wrapper", () => {
  const disclaimerText = "* Currently showing limited number of columns";
  const mockedPivotTable = StickyPivotTable as jest.MockedFunction<typeof StickyPivotTable>;
  mockedPivotTable.mockReturnValue(<div />);
  let layoutService: LayoutService;

  beforeEach(() => {
    layoutService = {
      hasLimitedData: false,
    } as LayoutService;
  });

  test("should render with a disclaimer", () => {
    layoutService.hasLimitedData = true;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService } as PivotTableProps)} />
      </TestWithProvider>
    );
    expect(screen.getByText(disclaimerText)).toBeVisible();
  });

  test("should render without a disclaimer", () => {
    layoutService.hasLimitedData = false;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService } as PivotTableProps)} />
      </TestWithProvider>
    );
    expect(screen.queryByText(disclaimerText)).toBeNull();
  });
});
