// src/pages/admin/ClinicClosures/sections/Table/Table.jsx
import { memo } from 'react';
import { Checkbox, Spin, Empty } from 'antd';
import Pagination from '../../../../../components/admin/Pagination/Pagination';
import {
  CLOSURE_TYPE_CONFIG,
  CLOSURE_STATUS_CONFIG,
  TABLE_COLUMNS,
} from '../../../../../data/admin/clinicClosures';
import { formatDate } from '../../../../../utils/dateFormatter';
import * as S from './Table.styled';

// ── Status Badge ──
const StatusBadge = memo(({ status }) => {
  const cfg = CLOSURE_STATUS_CONFIG[status] ?? {
    label: status,
    color: '#686868',
    bg: 'rgba(104,104,104,0.2)',
  };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} aria-hidden="true" />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ── Closure Type Badge ──
const ClosureTypeBadge = memo(({ type }) => {
  const cfg = CLOSURE_TYPE_CONFIG[type] ?? {
    label: type,
    icon: null,
  };
  const Icon = cfg.icon;
  return (
    <S.TypeBadge>
      {Icon && <Icon aria-hidden="true" />}
      <span>{cfg.label}</span>
    </S.TypeBadge>
  );
});
ClosureTypeBadge.displayName = 'ClosureTypeBadge';

// ── Actions ──
const Actions = memo(({ closure, onEdit, onDelete }) => {
  const handleClick = (e) => e.stopPropagation();
  return (
    <S.Actions onClick={handleClick}>
      <S.ActionBtn $variant="secondary" onClick={() => onEdit(closure)}>
        Edit
      </S.ActionBtn>
      <S.ActionBtn $variant="danger" onClick={() => onDelete(closure.id)}>
        Delete
      </S.ActionBtn>
    </S.Actions>
  );
});
Actions.displayName = 'Actions';

// ── Main Table ──
const ClosureTable = ({
  closures,
  selected,
  allSelected,
  onSelectAll,
  onSelectRow,
  loading,
  currentPage,
  totalEntries,
  pageSize,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const handleSelectAll = (e) => onSelectAll(e.target.checked);

  const handleRowClick = (e, closure) => {
    const target = e.target;
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('button') ||
      target.closest('.ant-checkbox') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    onRowClick?.(closure);
  };

  return (
    <S.TableCard>
      <S.TableWrapper>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : closures.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Empty description="No closures found" />
          </div>
        ) : (
          <S.StyledTable role="table" aria-label="Clinic closures">
            <S.THead>
              <S.TR>
                <S.TH $checkbox>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selected.size > 0 && !allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all closures"
                  />
                </S.TH>
                {TABLE_COLUMNS.map((col) => (
                  <S.TH key={col.key} $center={col.center} scope="col">
                    {col.label}
                  </S.TH>
                ))}
              </S.TR>
            </S.THead>

            <S.TBody>
              {closures.map((closure) => (
                <S.TR
                  key={closure.id}
                  $selected={selected.has(closure.id)}
                  onClick={(e) => handleRowClick(e, closure)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  <S.TD $checkbox>
                    <Checkbox
                      checked={selected.has(closure.id)}
                      onChange={() => onSelectRow(closure.id)}
                      aria-label={`Select closure ${closure.id}`}
                    />
                  </S.TD>
                  <S.TD>
                    <S.DateCell>
                      {formatDate(closure.date)}
                      <S.DayOfWeek>({closure.dayOfWeek})</S.DayOfWeek>
                    </S.DateCell>
                  </S.TD>
                  <S.TD $center>{closure.timeRange}</S.TD>
                  <S.TD>
                    <ClosureTypeBadge type={closure.closureType} />
                  </S.TD>
                  <S.TD>{closure.reason}</S.TD>
                  <S.TD $center>
                    <StatusBadge status={closure.status} />
                  </S.TD>
                  <S.TD $center>
                    <Actions closure={closure} onEdit={onEdit} onDelete={onDelete} />
                  </S.TD>
                </S.TR>
              ))}
            </S.TBody>
          </S.StyledTable>
        )}
      </S.TableWrapper>

      <Pagination
        currentPage={currentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </S.TableCard>
  );
};

export default memo(ClosureTable);