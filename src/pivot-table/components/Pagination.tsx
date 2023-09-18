import React from "react";
import type { PageInfo } from "../../types/types";
import { PAGINATION_HEIGHT } from "../constants";

interface PaginationProps {
  pageInfo: PageInfo;
  updatePageInfo: (args: Partial<PageInfo>) => void;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  width: "100%",
  height: `${PAGINATION_HEIGHT}px`,
  padding: "0 8px",
  boxSizing: "border-box",
};

const infoBoxStyle: React.CSSProperties = {
  margin: "8px",
};

const buttonsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export const testIdPageInfo = "page-info";
export const testIdDataRange = "data-range-info";

const Pagination = ({ pageInfo, updatePageInfo }: PaginationProps) => {
  const { totalPages, rowsPerPage, page, totalRowCount } = pageInfo;

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  const actionButtons = [
    { key: 1, label: "first", disabled: isFirstPage, onClick: () => updatePageInfo({ page: 0 }) },
    { key: 2, label: "prev", disabled: isFirstPage, onClick: () => updatePageInfo({ page: page - 1 }) },
    { key: 3, label: "next", disabled: isLastPage, onClick: () => updatePageInfo({ page: page + 1 }) },
    { key: 4, label: "last", disabled: isLastPage, onClick: () => updatePageInfo({ page: totalPages - 1 }) },
  ];

  return (
    <div style={containerStyle}>
      <span style={infoBoxStyle} data-testid={testIdPageInfo}>
        page: <b>{page + 1}</b> of <b>{totalPages}</b>
      </span>
      <span style={infoBoxStyle} data-testid={testIdDataRange}>
        {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, totalRowCount)} of {totalRowCount}
      </span>
      <div style={buttonsStyle}>
        {actionButtons.map(({ label, ...rest }) => (
          <button {...rest} data-testid={`${label}`} type="button">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
