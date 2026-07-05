// src/components/admin/Filter/MobileFilterToggle.jsx
import { memo } from 'react';
import { IoFilterOutline } from 'react-icons/io5';
import styled from 'styled-components';
import adminTheme from '../../../styles/adminTheme';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${adminTheme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${adminTheme.colors.black};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${adminTheme.colors.ivory};
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }

  svg {
    font-size: 18px;
    color: ${adminTheme.colors.primary};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileFilterToggle = memo(({ onClick, isOpen, count }) => (
  <ToggleButton
    onClick={onClick}
    aria-expanded={isOpen}
    aria-label="Toggle filters"
    type="button"
  >
    <IoFilterOutline aria-hidden="true" />
    <span>Filters</span>
    {count > 0 && (
      <Badge>{count}</Badge>
    )}
  </ToggleButton>
));

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${adminTheme.colors.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  line-height: 1;
`;

MobileFilterToggle.displayName = 'MobileFilterToggle';
export default MobileFilterToggle;