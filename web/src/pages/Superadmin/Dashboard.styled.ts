import styled from "styled-components";

export const Page = styled.div`
  padding: 30px;
  background: #f6f9ff;
  min-height: calc(100vh - 64px);
`;

export const Card = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

export const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin: 6px 6px 18px;
`;

export const Title = styled.h1`
  font-family:
    Inter,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.15;
  color: #0f172a;
  letter-spacing: -0.3px;
  margin: 0;
`;

export const SmallText = styled.div`
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  font-weight: 600;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;

  .ant-btn {
    height: 44px;
    padding: 0 18px;
    border-radius: 12px;
    font-weight: 700;
  }

  .ant-btn-primary {
    box-shadow: 0 10px 18px rgba(47, 109, 246, 0.18);
  }
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`;

export const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;
  border-radius: 999px;
  background: #f4f7ff;
  border: 1px solid rgba(47, 109, 246, 0.14);

  font-size: 13px;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.76);

  b {
    color: #0f172a;
    font-weight: 900;
  }
`;

export const Filters = styled.div`
  margin: 0 6px 16px 6px;
  padding: 14px;
  border-radius: 14px;
  background: #fbfcff;
  border: 1px solid rgba(15, 23, 42, 0.06);

  .ant-row {
    width: 100%;
  }

  .ant-col {
    margin-top: 10px;
  }

  .ant-picker,
  .ant-select {
    width: 100%;
    height: 44px;
  }

  .ant-picker {
    border-radius: 12px;
  }

  .ant-select-selector {
    height: 44px !important;
    border-radius: 12px !important;
    display: flex;
    align-items: center;
  }
`;

export const Split = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const Pill = styled.div`
  height: 44px;
  padding: 0 12px;
  border-radius: 12px;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);

  font-size: 13px;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.72);

  span {
    opacity: 0.9;
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 16px 16px 14px;

  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      480px 160px at 20% 0%,
      rgba(47, 109, 246, 0.12),
      transparent 60%
    );
    pointer-events: none;
  }
`;

export const StatLabel = styled.div`
  position: relative;
  color: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  font-weight: 800;
`;

export const StatValue = styled.div`
  position: relative;
  margin-top: 6px;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.4px;
  color: #0f172a;
`;

export const StatSub = styled.div`
  position: relative;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.52);
`;

export const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
`;

export const ChartTitle = styled.div`
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);

  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ChartBody = styled.div`
  padding: 14px 16px;
`;

export const TableWrap = styled.div`
  background: #ffffff;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  overflow: hidden;
`;

export const TableStyles = styled.div`
  .ant-table {
    background: transparent;
  }

  .ant-table-container {
    border-radius: 0;
  }

  .ant-table-thead > tr > th {
    background: #fafcff;
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
    font-weight: 600;
    color: #0f172a;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    vertical-align: middle;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(47, 109, 246, 0.04);
  }

  .ant-pagination {
    margin: 12px 14px 14px;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 10px;
  }
`;
