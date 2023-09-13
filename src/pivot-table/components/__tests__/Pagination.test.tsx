import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import type { PageInfo } from "../../../types/types";
import Pagination, { testIdDataRange, testIdPageInfo } from "../Pagination";

describe("<Pagination />", () => {
  let pageInfo: PageInfo;
  let updatePageInfo: jest.MockedFunction<(args: Partial<PageInfo>) => void>;

  const renderer = () => render(<Pagination {...{ pageInfo, updatePageInfo }} />);

  beforeEach(() => {
    updatePageInfo = jest.fn();
    pageInfo = {
      currentPage: 0,
      rowsPerPage: 5,
      totalPages: 10,
      totalRowCount: 45,
      shouldShowPagination: true,
      rowsOnCurrentPage: 5,
    };
  });

  test("should render properly", () => {
    renderer();

    // TODO:
    // make sure of translations
    expect(screen.getByTestId(testIdPageInfo)).toHaveTextContent(
      `page: ${pageInfo.currentPage + 1} of ${pageInfo.totalPages}`,
    );
    expect(screen.getByTestId(testIdDataRange)).toHaveTextContent(
      `${pageInfo.currentPage + 1} - ${pageInfo.rowsPerPage} of ${pageInfo.totalRowCount}`,
    );
    expect(screen.queryAllByRole("button").length).toBe(4);
    ["first", "prev", "next", "last"].forEach((btn) => {
      expect(screen.queryByText(btn)).toBeInTheDocument();
    });
  });

  test("should disable first and prev buttons if we are at the beginning of data set", () => {
    renderer();

    ["first", "prev"].forEach((btn) => {
      expect(screen.getByTestId(btn)).toHaveAttribute("disabled");
    });
    ["next", "last"].forEach((btn) => {
      expect(screen.getByTestId(btn)).not.toHaveAttribute("disabled");
    });
  });

  test("should disable next and last buttons if we are at the end of data set", () => {
    pageInfo = {
      ...pageInfo,
      currentPage: 9,
    };
    renderer();

    ["first", "prev"].forEach((btn) => {
      expect(screen.getByTestId(btn)).not.toHaveAttribute("disabled");
    });
    ["next", "last"].forEach((btn) => {
      expect(screen.getByTestId(btn)).toHaveAttribute("disabled");
    });
  });

  describe("should call `updatePageInfo` with proper arguments", () => {
    test("in case of next button clicked:", async () => {
      renderer();

      await userEvent.click(screen.getByTestId("next"));
      expect(updatePageInfo).toHaveBeenCalledTimes(1);
      expect(updatePageInfo).toHaveBeenCalledWith({ currentPage: pageInfo.currentPage + 1 });
    });

    test("in case of last button clicked:", async () => {
      renderer();

      await userEvent.click(screen.getByTestId("last"));
      expect(updatePageInfo).toHaveBeenCalledTimes(1);
      expect(updatePageInfo).toHaveBeenCalledWith({ currentPage: pageInfo.totalPages - 1 });
    });

    test("in case of prev button clicked:", async () => {
      pageInfo = {
        ...pageInfo,
        currentPage: 5,
      };
      renderer();

      await userEvent.click(screen.getByTestId("prev"));
      expect(updatePageInfo).toHaveBeenCalledTimes(1);
      expect(updatePageInfo).toHaveBeenCalledWith({ currentPage: pageInfo.currentPage - 1 });
    });

    test("in case of first button clicked:", async () => {
      pageInfo = {
        ...pageInfo,
        currentPage: 5,
      };
      renderer();

      await userEvent.click(screen.getByTestId("first"));
      expect(updatePageInfo).toHaveBeenCalledTimes(1);
      expect(updatePageInfo).toHaveBeenCalledWith({ currentPage: 0 });
    });
  });
});
