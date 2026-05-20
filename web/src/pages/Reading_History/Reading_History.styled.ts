import styled from "styled-components";

export const Page = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
  }

  p {
    margin: 6px 0 0;
    color: rgba(15, 23, 42, 0.6);
    font-size: 13px;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 10px 26px rgba(2, 6, 23, 0.06);
  padding: 14px;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: rgba(15, 23, 42, 0.55);
  font-size: 15px;
`;

export const BookCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }

  .meta {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.6);
  }
`;

export const DateText = styled.span`
  font-size: 13px;
  color: rgba(15, 23, 42, 0.75);
  white-space: nowrap;
`;
