import type { stardust } from "@nebula.js/stardust";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import type { App } from "../../../../types/QIX";
import type { HeaderCell } from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import DimensionTitleCell, { testId } from "../DimensionTitleCell";

describe("DimensionTitleCell", () => {
  const cell = { title: "test value" } as HeaderCell;
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

  test("should render", async () => {
    render(
      <DimensionTitleCell
        cell={cell}
        translator={translator}
        style={style}
        isLastColumn={false}
        changeSortOrder={changeSortOrder}
        changeActivelySortedHeader={changeActivelySortedColumn}
      />,
      { wrapper: TestWithProvider },
    );

    await waitFor(() => expect(screen.getByText(cell.title)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>));
  });

  describe("HeaderMenu", () => {
    let qDimensionInfo: EngineAPI.INxDimensionInfo;
    let model: EngineAPI.IGenericObject;
    let layout: EngineAPI.IGenericBaseLayout;
    let interactions: stardust.Interactions;

    beforeEach(() => {
      qDimensionInfo = {
        qFallbackTitle: cell.title,
        qStateCounts: {
          qAlternative: 1,
          qSelected: 1,
          qOption: 1,
        },
      } as EngineAPI.INxDimensionInfo;
      layout = { qHyperCube: { qDimensionInfo: [qDimensionInfo] } } as unknown as EngineAPI.IGenericBaseLayout;
      model = { getLayout: () => Promise.resolve(layout) } as EngineAPI.IGenericObject;
      interactions = { active: true, select: true, passive: true };
    });

    test("should be able to open header menu", async () => {
      render(
        <DimensionTitleCell
          cell={cell}
          translator={translator}
          style={style}
          isLastColumn={false}
          changeSortOrder={changeSortOrder}
          changeActivelySortedHeader={changeActivelySortedColumn}
        />,
        {
          wrapper: ({ children }) => (
            <TestWithProvider model={model} interactions={interactions}>
              {children}
            </TestWithProvider>
          ),
        },
      );

      await userEvent.click(screen.getByTestId("nebula-table-utils-head-menu-button"));

      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuGroupLabel.Sorting")).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Search")).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Selections")).toBeInTheDocument());
    });

    test("should not be able to header menu if `interactions.active` is false", async () => {
      interactions = { ...interactions, active: false };
      render(
        <DimensionTitleCell
          cell={cell}
          translator={translator}
          style={style}
          isLastColumn={false}
          changeSortOrder={changeSortOrder}
          changeActivelySortedHeader={changeActivelySortedColumn}
        />,
        {
          wrapper: ({ children }) => (
            <TestWithProvider model={model} interactions={interactions}>
              {children}
            </TestWithProvider>
          ),
        },
      );

      await userEvent.click(screen.getByTestId("nebula-table-utils-head-menu-button"));

      await waitFor(() =>
        expect(screen.queryByText("NebulaTableUtils.MenuGroupLabel.Sorting")).not.toBeInTheDocument(),
      );
      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Search")).not.toBeInTheDocument());
      await waitFor(() =>
        expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Selections")).not.toBeInTheDocument(),
      );
    });

    test("should not be able to see search and select menu items if `interactions.select` is false", async () => {
      interactions = { ...interactions, active: true, select: false };
      render(
        <DimensionTitleCell
          cell={cell}
          translator={translator}
          style={style}
          isLastColumn={false}
          changeSortOrder={changeSortOrder}
          changeActivelySortedHeader={changeActivelySortedColumn}
        />,
        {
          wrapper: ({ children }) => (
            <TestWithProvider model={model} interactions={interactions}>
              {children}
            </TestWithProvider>
          ),
        },
      );

      await userEvent.click(screen.getByTestId("nebula-table-utils-head-menu-button"));

      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuGroupLabel.Sorting")).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Search")).not.toBeInTheDocument());
      await waitFor(() =>
        expect(screen.queryByText("NebulaTableUtils.MenuItemLabel.Selections")).not.toBeInTheDocument(),
      );
    });

    test("should be able to open search menu", async () => {
      const popoverMock = jest.fn();
      const embed = { __DO_NOT_USE__: { popover: popoverMock } } as unknown as stardust.Embed;

      render(
        <DimensionTitleCell
          cell={cell}
          translator={translator}
          style={style}
          isLastColumn={false}
          changeSortOrder={changeSortOrder}
          changeActivelySortedHeader={changeActivelySortedColumn}
        />,
        {
          wrapper: ({ children }) => (
            <TestWithProvider model={model} embed={embed} interactions={interactions}>
              {children}
            </TestWithProvider>
          ),
        },
      );

      await userEvent.click(screen.getByTestId("nebula-table-utils-head-menu-button"));
      await userEvent.click(screen.getByText("NebulaTableUtils.MenuItemLabel.Search"));

      await waitFor(() =>
        expect(popoverMock).toHaveBeenCalledWith(expect.any(HTMLDivElement), undefined, {
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        }),
      );
    });

    test("should be able to open selections menu and select an item", async () => {
      const fieldInstanceMock = {
        selectAll: jest.fn(),
        selectPossible: jest.fn(),
        selectAlternative: jest.fn(),
        selectExcluded: jest.fn(),
      };
      const appMock = {
        getField: () => Promise.resolve(fieldInstanceMock),
      } as unknown as App;
      render(
        <DimensionTitleCell
          cell={cell}
          translator={translator}
          style={style}
          isLastColumn={false}
          changeSortOrder={changeSortOrder}
          changeActivelySortedHeader={changeActivelySortedColumn}
        />,
        {
          wrapper: ({ children }) => (
            <TestWithProvider model={model} app={appMock} interactions={interactions}>
              {children}
            </TestWithProvider>
          ),
        },
      );

      await userEvent.click(screen.getByTestId("nebula-table-utils-head-menu-button"));
      await userEvent.click(screen.getByText("NebulaTableUtils.MenuItemLabel.Selections"));
      await userEvent.click(screen.getByText("NebulaTableUtils.MenuItemLabel.SelectAll"));

      await waitFor(() => expect(fieldInstanceMock.selectAll).toHaveBeenCalled());
    });
  });
});
