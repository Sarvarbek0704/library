import styled, { keyframes } from "styled-components";

const fade = keyframes`from{opacity:0}to{opacity:1}`;
const up = keyframes`from{transform:translateY(10px);opacity:.7}to{transform:translateY(0);opacity:1}`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.18);
  backdrop-filter: blur(5px);
  z-index: 1000;
  animation: ${fade} 140ms ease-out;
`;

export const Card = styled.div`
  position: fixed;
  left: 140px;
  bottom: 70px;
  width: 300px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 22px 50px rgba(0,0,0,.22);
  z-index: 1001;
  overflow: hidden;
  animation: ${up} 160ms ease-out;

  @media (max-width: 600px) {
    left: 16px;
    right: 16px;
    width: auto;
  }
`;

export const Head = styled.div`
  padding: 12px 12px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Close = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: rgba(15, 23, 42, 0.06);
  cursor: pointer;
  font-size: 20px;
`;

export const Row = styled.div`
  height: 46px;
  padding: 0 12px 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 10px;

  &:last-child {
    padding-bottom: 14px;
  }
`;

export const Key = styled.div`
  font-weight: 800;
  color: rgba(15, 23, 42, 0.75);
  font-size: 13px;
`;

export const Select = styled.select`
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0 10px;
  font-weight: 800;
  outline: none;
`;
