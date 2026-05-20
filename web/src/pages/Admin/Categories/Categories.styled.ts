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
  margin-left: 12px;
  margin-right: 12px;
`;

export const TableStyles = styled.div`
  .ant-table {
    background: transparent;
  }

  .ant-table-container {
    border-radius: 12px;
  }

  .ant-table-thead > tr > th {
    background: #fafafa;
    color: #0f172a;
    font-weight: 800;
    font-size: 15px;
    padding: 18px 18px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

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

  .ant-table-pagination {
    margin: 18px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  .ant-pagination-total-text {
    color: #0f172a;
    font-weight: 700;
    margin-right: 10px;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 10px;
  }

  .ant-pagination-item {
    border-color: rgba(15, 23, 42, 0.15);
    background: #fff;
  }

  .ant-pagination-item a {
    color: #0f172a;
    font-weight: 800;
  }

  .ant-pagination-item-active {
    background: #1677ff;
    border-color: #1677ff;
  }
  .ant-pagination-item-active a {
    color: #fff;
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    border-radius: 10px;
    border-color: rgba(15, 23, 42, 0.15);
    background: #fff;
    color: #0f172a;
  }

  .ant-pagination-options {
    margin-left: 12px;
  }

  .ant-select-selector {
    border-radius: 10px !important;
    height: 36px !important;
    display: flex;
    align-items: center;
    border-color: rgba(15, 23, 42, 0.15) !important;
    background: #fff !important;
  }

  .ant-select-dropdown {
    border-radius: 12px !important;
  }
`;
