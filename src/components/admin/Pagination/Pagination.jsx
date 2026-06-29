// src/components/admin/Pagination/Pagination.jsx
import { memo, useMemo } from "react";
import { Select } from "antd";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import * as S from "./Pagination.styled";

const { Option } = Select;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const MAX_VISIBLE_PAGES = 3;

/**
 * @param {number}   currentPage   — 1-based
 * @param {number}   totalEntries
 * @param {number}   pageSize
 * @param {function} onPageChange  — (page: number) => void
 * @param {function} onSizeChange  — (size: number) => void
 */
const Pagination = ({
  currentPage,
  totalEntries,
  pageSize,
  onPageChange,
  onSizeChange,
}) => {
  const totalPages = Math.ceil(totalEntries / pageSize);

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalEntries);

  const pages = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result = [];
    // Always show first MAX_VISIBLE_PAGES pages
    for (let i = 1; i <= MAX_VISIBLE_PAGES; i++) result.push(i);
    // Ellipsis
    if (currentPage < totalPages - 1) result.push("...");
    // Always show last page
    result.push(totalPages);

    return result;
  }, [totalPages, currentPage]);

  return (
    <S.PaginationBar>
      <S.EntriesInfo aria-live="polite">
        Showing {rangeStart} to {rangeEnd} of {totalEntries} entries
      </S.EntriesInfo>

      <S.PageControls role="navigation" aria-label="Pagination">
        <S.NavBtn
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <IoChevronBackOutline size={14} />
        </S.NavBtn>

        {pages.map((page, idx) =>
          page === "..." ? (
            <S.PageBtn key={`ellipsis-${idx}`} $ellipsis disabled>
              ...
            </S.PageBtn>
          ) : (
            <S.PageBtn
              key={page}
              $active={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </S.PageBtn>
          )
        )}

        <S.NavBtn
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <IoChevronForwardOutline size={14} />
        </S.NavBtn>
      </S.PageControls>

      <S.SizeSelectWrapper>
        <Select
          value={pageSize}
          onChange={onSizeChange}
          aria-label="Rows per page"
          size="small"
          popupMatchSelectWidth={false}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <Option key={size} value={size}>
              {size} / page
            </Option>
          ))}
        </Select>
      </S.SizeSelectWrapper>
    </S.PaginationBar>
  );
};

export default memo(Pagination);