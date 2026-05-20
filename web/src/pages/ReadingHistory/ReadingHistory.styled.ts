import styled from "styled-components";

export const Wrap = styled.div`
  padding: 24px;
  min-height: 100vh;
`;

export const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
  }
`;

export const Img = styled.img`
  width: 100%;
  height: 260px;
  object-fit: contain;
  background: #f3f6fb;
  border-radius: 12px;
  display: block;
`;

export const Title = styled.h3`
  margin: 12px 0 6px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Small = styled.div`
  font-size: 12px;
  color: rgba(15, 23, 42, 0.7);
`;

export const Empty = styled.div`
  margin-top: 20px;
  color: rgba(15, 23, 42, 0.65);
`;
