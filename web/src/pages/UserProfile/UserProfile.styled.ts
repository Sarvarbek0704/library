import styled from "styled-components";

export const Page = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const TopActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
  padding: 16px;
`;

export const LeftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AvatarCircle = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  font-weight: 900;
  font-size: 28px;
  color: #0f172a;

  background: linear-gradient(135deg, #93c5fd, #a78bfa);
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

export const Name = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
`;

export const Sub = styled.div`
  color: rgba(15, 23, 42, 0.65);
  font-weight: 600;
`;

export const PillRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 6px 0;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
  align-items: center;

  @media (max-width: 920px) {
    grid-template-columns: 120px 1fr;
  }
`;

export const Key = styled.div`
  color: rgba(15, 23, 42, 0.65);
  font-weight: 700;
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

export const Val = styled.div`
  color: #0f172a;
  font-weight: 800;
  word-break: break-word;
`;

export const Muted = styled.div`
  color: rgba(15, 23, 42, 0.55);
  font-size: 12px;
  font-weight: 600;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;

  &:hover {
    background: rgba(15, 23, 42, 0.02);
  }

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

export const ListLeft = styled.div`
  min-width: 0;
`;

export const ListTitle = styled.div`
  font-weight: 900;
  color: #0f172a;
`;

export const ListSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.6);
  font-weight: 600;
  line-height: 1.5;
`;

export const ListRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const Money = styled.div`
  font-weight: 900;
  color: #0f172a;
`;
