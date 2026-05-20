import styled from "styled-components";

export const AdminPage = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-page);
`;

export const AdminCard = styled.div`
  background: var(--bg-surface);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
`;

export const AdminTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
`;

export const AdminTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
`;

export const AdminActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  .ant-btn {
    height: 42px;
    border-radius: 12px;
    font-weight: 700;
  }
`;

export const AdminTableWrap = styled.div`
  .ant-table {
    background: transparent;
    color: var(--text);
  }

  .ant-table-container {
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background: var(--bg-surface);
    color: var(--text);
    font-weight: 800;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .ant-table-tbody > tr > td {
    background: transparent;
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(34, 197, 94, 0.08);
  }

  html[data-theme="light"] & .ant-table-tbody > tr:hover > td {
    background: rgba(37, 99, 235, 0.06);
  }

  .ant-table-pagination {
    margin: 16px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  .ant-pagination-total-text {
    color: var(--text);
    font-weight: 800;
    margin-right: 10px;
  }

  .ant-pagination {
    color: var(--text);
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 12px;
  }

  .ant-pagination-item {
    background: var(--bg-surface);
    border-color: var(--border);
  }

  .ant-pagination-item a {
    color: var(--text);
    font-weight: 800;
  }

  .ant-pagination-item-active {
    background: var(--accent);
    border-color: var(--accent);
  }

  .ant-pagination-item-active a {
    color: #05220f;
  }

  html[data-theme="light"] & .ant-pagination-item-active a {
    color: #ffffff;
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    background: var(--bg-surface);
    border-color: var(--border);
    color: var(--text);
    border-radius: 12px;
  }

  .ant-pagination-options {
    margin-left: 12px;
  }

  .ant-pagination .ant-select-selector {
    background: var(--bg-surface) !important;
    border-color: var(--border) !important;
    color: var(--text) !important;
    border-radius: 12px !important;
  }

  .ant-select-dropdown {
    border-radius: 12px !important;
  }
`;
