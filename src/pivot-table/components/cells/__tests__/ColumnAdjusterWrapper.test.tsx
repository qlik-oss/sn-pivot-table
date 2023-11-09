import type { stardust } from "@nebula.js/stardust";
import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { AdjusterCellInfo, DataModel, ExtendedSelections } from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import ColumnAdjusterWrapper from "../ColumnAdjusterWrapper";

describe("<ColumnAdjuster />", () => {
  let cellInfo: AdjusterCellInfo;
  let selections: ExtendedSelections;
  let interactions: stardust.Interactions;

  beforeEach(() => {
    cellInfo = { canBeResized: true } as AdjusterCellInfo;
    interactions = { active: true };
    selections = { isActive: () => false } as ExtendedSelections;
  });

  const renderAdjuster = () =>
    render(
      <ColumnAdjusterWrapper cellInfo={cellInfo} columnWidth={100} dataModel={{} as DataModel} isLastColumn={false} />,
      {
        wrapper: ({ children }) => (
          <TestWithProvider selections={selections} interactions={interactions}>
            {children}
          </TestWithProvider>
        ),
      },
    );

  afterEach(() => jest.clearAllMocks());

  test("should render ColumnAdjuster", () => {
    renderAdjuster();
    // TODO: import class string
    expect(screen.queryByTestId(COLUMN_ADJUSTER_CLASS)).toBeInTheDocument();
  });

  test("should not render ColumnAdjuster when canBeResized is false", () => {
    cellInfo = { canBeResized: false } as AdjusterCellInfo;
    renderAdjuster();

    expect(screen.queryByTestId(COLUMN_ADJUSTER_CLASS)).not.toBeInTheDocument();
  });

  test("should not render ColumnAdjuster when isActive is true", () => {
    selections.isActive = () => true;
    renderAdjuster();

    expect(screen.queryByTestId(COLUMN_ADJUSTER_CLASS)).not.toBeInTheDocument();
  });

  test("should not render ColumnAdjuster when interactions.active is false", () => {
    interactions.active = false;
    renderAdjuster();

    expect(screen.queryByTestId(COLUMN_ADJUSTER_CLASS)).not.toBeInTheDocument();
  });
});
