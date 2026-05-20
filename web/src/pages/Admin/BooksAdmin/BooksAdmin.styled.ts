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
  margin: 20px;
`;

export const Title = styled.h1`
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

/* Filters row (search + 3 selects) */
export const Filters = styled.div`
  margin: 0 22px 16px 22px;

  .ant-row {
    width: 100%;
  }

  .ant-col {
    margin-top: 10px;
  }

  .ant-input-affix-wrapper,
  .ant-select {
    width: 100%;
    height: 44px;
  }

  .ant-input-affix-wrapper {
    border-radius: 10px;
    display: flex;
    align-items: center;
  }

  .ant-select-selector {
    height: 44px !important;
    border-radius: 10px !important;
    display: flex;
    align-items: center;
  }
`;

export const TableWrap = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 16px;
  overflow: hidden;
  margin-left: 22px;
  margin-right: 22px;
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
    white-space: nowrap;
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

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 10px;
  }

  .ant-pagination-options {
    margin-left: 12px;
  }

  .ant-select-selector {
    border-radius: 10px !important;
    height: 36px !important;
    display: flex;
    align-items: center;
  }
`;

export const Thumb = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

export const DetailBox = styled.div`
  background: #fafafa;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 14px;
  margin: 0 0 16px 0;

  strong {
    display: block;
    color: #0f172a;
    font-weight: 800;
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
    color: rgba(15, 23, 42, 0.75);
    font-size: 13px;
    line-height: 1.35;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;

  .ant-btn {
    height: 40px;
    border-radius: 10px;
    font-weight: 600;
    padding: 0 18px;
  }
`;

export const UploadHint = styled.div`
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
  margin-top: 8px;
`;
