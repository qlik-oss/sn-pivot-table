import React from "react";
import type { PageInfo } from "../../hooks/use-pivot-table";
import type { DataModel } from "../../types/types";
import { PAGINATION_HEIGHT } from "../constants";

interface PaginationProps {
  pageInfo: PageInfo;
  dataModel: DataModel;
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

export const Pagination = ({ pageInfo, updatePageInfo, dataModel }: PaginationProps) => {
  const { totalPages, rowsPerPage, currentPage, totalRowCount } = pageInfo;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const handleChangePage = (currentPage: number) => {
    updatePageInfo({ currentPage });
    dataModel.fetchNewPage({ ...pageInfo, currentPage });
  };

  const actionButtons = [
    { key: 1, label: "first", disabled: isFirstPage, onClick: () => handleChangePage(0) },
    { key: 2, label: "prev", disabled: isFirstPage, onClick: () => handleChangePage(currentPage - 1) },
    { key: 3, label: "next", disabled: isLastPage, onClick: () => handleChangePage(currentPage + 1) },
    { key: 4, label: "last", disabled: isLastPage, onClick: () => handleChangePage(totalPages - 1) },
  ];

  return (
    <div style={containerStyle}>
      <span style={infoBoxStyle}>
        page: <b>{currentPage + 1}</b> of <b>{totalPages}</b>
      </span>
      <span style={infoBoxStyle}>
        {currentPage * rowsPerPage + 1} - {Math.min((currentPage + 1) * rowsPerPage, totalRowCount)} of {totalRowCount}
      </span>
      <div style={buttonsStyle}>
        {actionButtons.map(({ label, ...rest }) => (
          <button {...rest}>{label}</button>
        ))}
      </div>
    </div>
  );
};
