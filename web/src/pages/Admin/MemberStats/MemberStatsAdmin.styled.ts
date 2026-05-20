import styled from "styled-components";

export const Page = styled.div`
  padding: 30px;
  background: #f5f7fb;
  min-height: 100vh;
`;

export const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

export const Title = styled.h1`
  margin: 0 0 20px;
  font-family: sans-serif;      
  font-size: 25px;           
  font-weight: 600;        
  line-height: 1.3;
  color: #344054;          
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
`;

export const TableWrap = styled.div`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    font-weight: 800;
    background: #fafafa;
  }

  .ant-table-tbody > tr:hover > td {
    background: #fafcff;
  }

  .ant-pagination-total-text {
    font-weight: 600;
  }
`;

export const HelpCell = styled.div`
  cursor: help;
  font-weight: 700;
`;

export const BookCell = styled.div``;

export const BookTitle = styled.div`
  font-weight: 700;
`;

export const BookAuthor = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;
