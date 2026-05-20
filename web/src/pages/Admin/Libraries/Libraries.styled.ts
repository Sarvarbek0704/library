import styled from "styled-components";

export const Page = styled.div`
  padding: 30px;
  background: #f5f7fb;
  min-height: calc(100vh - 64px);
`;

export const Card = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  padding: 26px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

export const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin: 10px;
`;

export const Title = styled.h1`
  margin: 0 0 20px;
  font-family: sans-serif;      
  font-size: 30px;           
  font-weight: 600;        
  line-height: 1.3;
  color: #344054;          
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;

  .ant-btn {
    height: 44px;
    padding: 0 18px;
    border-radius: 10px;
    font-weight: 600;
  }
`;

export const TableWrap = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 16px;
  overflow: hidden;
`;

export const TableStyles = styled.div`
  .ant-table {
    background: transparent;
  }

  .ant-table-container {
    border-radius: 12px;
  }

  /* Header */
  .ant-table-thead > tr > th {
    background: #fafafa;
    color: #0f172a;
    font-weight: 800;
    font-size: 15px;
    padding: 18px 18px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

  /* Body */
  .ant-table-tbody > tr > td {
    padding: 22px 18px;
    font-size: 15px;
    color: #0f172a;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    vertical-align: middle;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(24, 144, 255, 0.04);
  }

  .ant-btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 8px;
    font-weight: 500;
  }

  /* ✅ Pagination wrapper */
  .ant-table-pagination {
    margin: 18px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  /* ✅ Pagination list itself */
  .ant-pagination {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ✅ Jami: ... text */
  .ant-pagination-total-text {
    margin-right: 8px;
    color: #475569;
    font-weight: 600;
  }

  /* ✅ Page items */
  .ant-pagination-item {
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    min-width: 38px;
    height: 38px;
    line-height: 36px;
  }

  .ant-pagination-item a {
    color: #0f172a;
    font-weight: 600;
  }

  .ant-pagination-item-active {
    border-color: #1677ff;
  }

  .ant-pagination-item-active a {
    color: #1677ff;
  }

  /* ✅ Prev/Next buttons (arrow) */
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 10px;
    min-width: 38px;
    height: 38px;
    border: 1px solid #e5e7eb;
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    border-radius: 10px;
    width: 38px;
    height: 38px;
  }

  .ant-pagination-disabled {
    opacity: 0.5;
  }

  /* ✅ Page size selector (10 / page) */
  .ant-pagination-options {
    margin-left: 12px;
  }

  .ant-select {
    min-width: 110px;
  }

  .ant-select-selector {
    border-radius: 10px !important;
    height: 38px !important;
    display: flex;
    align-items: center;
  }

  .ant-select-selection-item {
    font-weight: 600;
    color: #0f172a;
  }
`;
