// src/components/UserMenu/UserMenu.styled.ts
import styled, { keyframes } from "styled-components";

const pop = keyframes`
  from { transform: translateY(6px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const MenuWrap = styled.div`
  position: relative;
`;

export const Trigger = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AvatarWrap = styled.div`
  width: 50px;
  height: 40px;

  border-radius: 50%;
  overflow: hidden;

  border: none;
  padding: 0;
  background: none;

  display: block;
  flex: 0 0 40px;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  border-radius: 50%; 
`;

export const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  font-weight: 900;
  font-size: 16px;
  color: #0f172a;

  border: none;
  padding: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);

  border-radius: 50%;
`;



export const NameText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: 260px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
  padding: 10px;
  animation: ${pop} 140ms ease-out;
  z-index: 1000;
`;

export const Head = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 8px 10px;
`;

export const HeadInfo = styled.div`
  min-width: 0;
`;

export const HeadName = styled.div`
  font-weight: 800;
  font-size: 14px;
  color: #0f172a;
`;

export const HeadEmail = styled.div`
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 6px 0;
`;

export const Item = styled.button`
  width: 100%;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  font-weight: 700;
  color: #0f172a;

  &:hover {
    background: rgba(15, 23, 42, 0.06);
  }
`;

export const LeftIcon = styled.span`
  width: 22px;
  display: inline-grid;
  place-items: center;
`;

export const RightArrow = styled.span`
  margin-left: auto;
  color: rgba(15, 23, 42, 0.4);
  font-size: 18px;
`;

export const TinyPill = styled.span`
  margin-left: auto;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.7);
`;

export const PopMini = styled.div`
  position: absolute;
  right: 10px;
  top: 42px;
  width: 110px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  overflow: hidden;
`;

export const MiniItem = styled.button`
  width: 100%;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 700;
  color: #0f172a;

  &:hover {
    background: rgba(15, 23, 42, 0.06);
  }
`;
