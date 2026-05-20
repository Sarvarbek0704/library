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
  font-weight: 700;
  line-height: 1.2;
  color: #344054;
`;

export const SmallText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.55);
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .ant-btn {
    height: 44px;
    padding: 0 18px;
    border-radius: 10px;
    font-weight: 600;
  }
`;

export const Chips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

export const Chip = styled.div`
  background: #f5f8ff;
  border: 1px solid rgba(47, 109, 246, 0.18);
  color: rgba(15, 23, 42, 0.75);
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;

  b {
    color: #2f6df6;
  }
`;

export const Filters = styled.div`
  margin: 0 22px 16px 22px;

  .ant-col {
    margin-top: 10px;
  }

  .ant-picker,
  .ant-select {
    width: 100%;
    height: 44px;
  }

  .ant-picker {
    border-radius: 10px;
  }

  .ant-select-selector {
    height: 44px !important;
    border-radius: 10px !important;
    display: flex;
    align-items: center;
  }
`;

export const Split = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  height: 44px;
`;

export const Pill = styled.div`
  height: 44px;
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;

  span {
    font-size: 13px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.65);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 0 22px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 16px 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

export const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.55);
`;

export const StatValue = styled.div`
  margin-top: 8px;
  font-size: 30px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.6px;
`;

export const StatSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.45);
`;

export const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  overflow: hidden;
`;

export const ChartTitle = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ChartBody = styled.div`
  padding: 12px 14px;
`;

export const TableWrap = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 12px;
`;

export const TableStyles = styled.div`
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: #fafafa;
    color: #0f172a;
    font-weight: 900;
    font-size: 13px;
    padding: 14px 14px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    white-space: nowrap;
  }

  .ant-table-tbody > tr > td {
    padding: 14px 14px;
    font-size: 13px;
    color: #0f172a;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    vertical-align: middle;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(24, 144, 255, 0.04);
  }
`;
