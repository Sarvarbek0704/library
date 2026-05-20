import styled from "styled-components";

export const Page = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: var(--bg-page);
`;

export const Card = styled.div`
  background: var(--bg-surface);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
`;

export const Actions = styled.div``;

export const TableWrap = styled.div`
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

  .ant-pagination {
    color: var(--text);
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
  }

  .ant-pagination .ant-select-selector {
    background: var(--bg-surface);
    border-color: var(--border);
    color: var(--text);
  }
`;
