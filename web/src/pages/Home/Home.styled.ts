import styled from "styled-components";

export const LeaderBoardWrapper = styled.div`
  margin: 22px;
  border-radius: 14px;
  padding: 18px;
  background: #ffffff;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 28px rgba(15, 23, 42, 0.1);

  border: 1px solid rgba(15, 23, 42, 0.06);
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.3px;
`;

export const Muted = styled.div`
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  font-weight: 700;
`;

export const TopLeaderBoard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 14px;

  padding-bottom: 14px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;

  .rank {
    display: flex;
    gap: 10px;
    align-items: center;

    p {
      font-size: 14px;
      color: rgba(15, 23, 42, 0.7);
      font-weight: 800;
      margin: 0;
    }

    span {
      display: inline-block;
      padding: 8px 12px;
      background-color: #eff6ff;
      border: 1px solid rgba(47, 109, 246, 0.2);
      border-radius: 12px;

      font-weight: 900;
      color: #0f172a;
    }
  }

  .score {
    p {
      margin: 0;
      font-size: 14px;
      color: rgba(15, 23, 42, 0.62);
      font-weight: 800;
    }

    span {
      display: inline-block;
      font-size: 16px;
      color: #0f172a;
      font-weight: 900;
    }
  }

  @media (max-width: 780px) {
    align-items: flex-start;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 14px 14px 12px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      520px 180px at 20% 0%,
      rgba(47, 109, 246, 0.12),
      transparent 60%
    );
    pointer-events: none;
  }
`;

export const StatLabel = styled.div`
  position: relative;
  color: rgba(15, 23, 42, 0.62);
  font-size: 12px;
  font-weight: 900;
`;

export const StatValue = styled.div`
  position: relative;
  margin-top: 6px;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.4px;
  color: #0f172a;
`;

export const StatSub = styled.div`
  position: relative;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.52);
`;

export const SplitRow = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  .ant-btn {
    height: 44px;
    border-radius: 12px;
    font-weight: 800;
    padding: 0 16px;
  }

  .ant-btn-primary {
    box-shadow: 0 10px 18px rgba(47, 109, 246, 0.18);
  }
`;

export const AvatarCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  background: #eff6ff;
  border: 1px solid rgba(47, 109, 246, 0.25);
  color: #2563eb;
  font-weight: 900;
  letter-spacing: 0.5px;
`;

export const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  min-width: 0;
`;

export const ChartTitle = styled.div`
  padding: 14px 14px;
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;

export const ChartBody = styled.div`
  padding: 14px 14px;
`;

export const Rank = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 12px;
  background: #fafcff;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);

  div {
    display: flex;
    gap: 18px;
  }

  p {
    margin: 0;
    font-weight: 900;
    font-size: 13px;
    color: rgba(15, 23, 42, 0.72);
  }
`;

export const User = styled.div`
  background-color: #ffffff;

  > :hover {
    background-color: #f9fafb;
  }

  > div {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  > div > div {
    display: flex;
    gap: 14px;
    height: 40px;
    align-items: center;

    .rankU {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      background-color: #2f6df6;
      border-radius: 8px;
      color: white;
      font-weight: 900;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      overflow: hidden;

      background: #eff6ff;
      display: grid;
      place-items: center;
      border: 1px solid #dbeafe;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-text {
      color: #2563eb;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: 0.5px;
    }

    p {
      margin: 0;
      font-weight: 800;
      color: #0f172a;
    }
  }

  .isMe {
    background-color: #eff6ff;
    border-left: 4px solid #2563eb;
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);
  }

  > div > p {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
  }
`;

export const MiniList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MiniItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;

  b {
    display: block;
    font-size: 14px;
    font-weight: 900;
    color: #0f172a;
    max-width: 520px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.55);
  }

  small {
    font-size: 12px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.55);
    white-space: nowrap;
  }
`;

/* ✅ Saved by Library legend (o‘ng tomonni chiroyli to‘ldiradi) */
export const LegendList = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 12px;
  background: #ffffff;
  height: 260px;
  overflow: auto;
`;

export const LegendItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  padding: 10px 8px;
  border-radius: 12px;

  &:hover {
    background: #f8fafc;
  }

  span {
    max-width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-weight: 800;
    color: rgba(15, 23, 42, 0.82);
    font-size: 13px;
  }

  b {
    font-weight: 900;
    color: #0f172a;
  }
`;

export const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
`;
