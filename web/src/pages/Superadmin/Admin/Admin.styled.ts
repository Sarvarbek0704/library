import styled from "styled-components";

export const Page = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: #f5f7fb;
`;

export const Card = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

export const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  line-height: 1.25;
  color: #0f172a;
  padding-top: 2px;
`;

export const Actions = styled.div`
  @media (max-width: 700px) {
    .ant-btn {
      width: 100%;
    }
  }
`;

export const TableWrap = styled.div`
  .ant-table-container {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eef2f7;
  }

  .ant-table-thead > tr > th {
    font-weight: 800;
    background: #ffffff;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(37, 99, 235, 0.05);
  }
`;
