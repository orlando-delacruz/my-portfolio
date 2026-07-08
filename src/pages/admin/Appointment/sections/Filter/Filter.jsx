// src/pages/admin/Appointment/sections/Filter/Filter.jsx
import { memo, useMemo, useState } from "react";
import { Collapse } from "antd";
import { IoRefreshOutline } from "react-icons/io5";
import DateFilter from "../../../../../components/admin/Filter/Date/Date";
import Branch from "../../../../../components/admin/Filter/Branch/Branch";
import Status from "../../../../../components/admin/Filter/Status/Status";
import Search from "../../../../../components/admin/Filter/Search/Search";
import SourceFilter from "../../../../../components/admin/Filter/Source/Source";
import * as S from "./Filter.styled";

const Filter = ({ filters, onChange, onReset }) => {
  const [activeKey, setActiveKey] = useState([]);
  const isActive = activeKey.includes("filters");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search?.trim()) count++;
    if (filters.branch && filters.branch !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) count++;
    if (filters.source && filters.source !== 'all') count++;
    return count;
  }, [filters]);

  const headerContent = (
    <S.PanelHeader>
      <S.HeaderLeft>
        <S.CardTitle>Filters</S.CardTitle>
        <S.CardSubtitle>
          Quickly find appointments using the filters below.
        </S.CardSubtitle>
      </S.HeaderLeft>
      <S.HeaderRight>
        {activeFilterCount > 0 && (
          <S.FilterBadge>{activeFilterCount}</S.FilterBadge>
        )}
        <S.ToggleText>
          {isActive ? 'Hide Filters' : 'Show Filters'}
        </S.ToggleText>
      </S.HeaderRight>
    </S.PanelHeader>
  );

  const panelContent = (
    <S.FilterBody>
      <S.FilterRow>
        <S.SearchWrapper>
          <Search
            value={filters.search}
            onChange={(val) => onChange('search', val)}
            placeholder="Search patient name or mobile number…"
          />
        </S.SearchWrapper>

        <S.FilterGroup>
          <Status
            value={filters.status}
            onChange={(val) => onChange('status', val)}
          />
          <Branch
            value={filters.branch}
            onChange={(val) => onChange('branch', val)}
          />
          <DateFilter
            value={filters.dateRange}
            onChange={(val) => onChange('dateRange', val)}
          />
          <SourceFilter
            value={filters.source}
            onChange={(val) => onChange('source', val)}
          />
        </S.FilterGroup>
      </S.FilterRow>

      <S.ActionRow>
        <S.ResetButton type="button" onClick={onReset} aria-label="Reset all filters">
          <IoRefreshOutline aria-hidden="true" />
          Reset Filters
        </S.ResetButton>
      </S.ActionRow>
    </S.FilterBody>
  );

  const collapseItems = [
    {
      key: 'filters',
      label: headerContent,
      children: panelContent,
    },
  ];

  return (
    <S.FilterCardWrapper>
      <Collapse
        ghost
        activeKey={activeKey}
        onChange={setActiveKey}
        expandIconPlacement="end"
        items={collapseItems}
        expandIcon={({ isActive: expanded }) => (
          <S.ChevronIcon $expanded={expanded} />
        )}
      />
    </S.FilterCardWrapper>
  );
};

export default memo(Filter);