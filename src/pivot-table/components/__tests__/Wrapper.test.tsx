import type { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { LayoutService, PageInfo, Rect } from "../../../types/types";
import TestWithProvider from "../../__tests__/test-with-providers";
import { StickyPivotTable } from "../PivotTable";
import type { WrapperProps } from "../Wrapper";
import { Wrapper } from "../Wrapper";

jest.mock("../PivotTable");

describe("Wrapper", () => {
  const mockedPivotTable = StickyPivotTable as jest.MockedFunction<typeof StickyPivotTable>;
  let layoutService: LayoutService;
  let translator: stardust.Translator;
  let pageInfo: PageInfo;
  let rect: Rect;

  beforeEach(() => {
    layoutService = {
      hasLimitedData: false,
      hasData: true,
      layout: {
        qInfo: {
          qId: "test",
        },
      },
    } as LayoutService;
    translator = {
      get: (str: string) => str,
    } as unknown as stardust.Translator;
    pageInfo = {
      page: 0,
      rowsPerPage: 50,
      totalPages: 100,
      shouldShowPagination: false,
      totalRowCount: 100,
    } as PageInfo;

    rect = { width: 1000, height: 1000 };

    mockedPivotTable.mockReturnValue(<div />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should render with a limited data disclaimer", () => {
    layoutService.hasLimitedData = true;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo, rect } as unknown as WrapperProps)} />
      </TestWithProvider>,
    );
    expect(screen.getByText("SNPivotTable.LimitedData")).toBeVisible();
  });

  test("should render without limited data disclaimer", () => {
    layoutService.hasLimitedData = false;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo, rect } as unknown as WrapperProps)} />
      </TestWithProvider>,
    );
    expect(screen.queryByText("SNPivotTable.LimitedData")).toBeNull();
  });

  test("should render with a no data disclaimer", () => {
    layoutService.hasData = false;
    render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo, rect } as unknown as WrapperProps)} />
      </TestWithProvider>,
    );
    expect(screen.getByText("SNPivotTable.NoData")).toBeVisible();
    expect(mockedPivotTable).not.toHaveBeenCalled();
  });

  test("should render with pagination", () => {
    pageInfo.shouldShowPagination = true;
    const { queryAllByRole, queryAllByTestId } = render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo, rect } as unknown as WrapperProps)} />
      </TestWithProvider>,
    );

    expect(queryAllByRole("button").length).toBe(4);
    expect(queryAllByTestId("pagination-action-icon-button").length).toBe(4);
  });

  test("should render with out pagination", () => {
    pageInfo.shouldShowPagination = false;
    const { queryAllByRole, queryByText } = render(
      <TestWithProvider>
        <Wrapper {...({ layoutService, translator, pageInfo, rect } as unknown as WrapperProps)} />
      </TestWithProvider>,
    );

    expect(queryAllByRole("button").length).toBe(0);
    ["first", "prev", "next", "last"].forEach((btn) => {
      expect(queryByText(btn)).not.toBeInTheDocument();
    });
  });
});
