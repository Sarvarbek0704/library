import styled, { keyframes } from "styled-components";

const fade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const up = keyframes`
  from { transform: translate3d(0, 14px, 0); opacity: .7; }
  to   { transform: translate3d(0, 0, 0); opacity: 1; }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.35);
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: ${fade} 140ms ease-out;

  /* ✅ markazlashni transform bilan emas, flex bilan qilamiz */
  display: flex;
  align-items: center;
  justify-content: center;

  /* ixtiyoriy: ichki scroll bo‘lsa */
  padding: 16px;
`;

export const Card = styled.div`
  width: min(740px, calc(100vw - 32px));
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  overflow: hidden;

  /* ✅ sakramasligi uchun */
  will-change: transform;
  animation: ${up} 160ms ease-out;

  /* ✅ content kelganda balandlik o‘zgarsa ham sakramaydi */
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
`;

export const CardHead = styled.div`
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AvatarPickBtn = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
`;

export const BigAvatarWrap = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;

  border: none;
  padding: 0;
  background: none;

  display: block;
  flex: 0 0 56px;
`;

export const BigAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 50%;
`;

export const BigAvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  font-weight: 900;
  font-size: 20px;
  color: #0f172a;

  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

export const HeadTexts = styled.div``;

export const BigName = styled.div`
  font-weight: 900;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.2;

  /* ✅ joy sakramasin */
  min-height: 18px;
`;

export const BigEmail = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);

  /* ✅ joy sakramasin */
  min-height: 14px;
`;

export const Close = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(15, 23, 42, 0.06);
  cursor: pointer;
  font-size: 20px;
  color: rgba(15, 23, 42, 0.7);

  &:hover {
    background: rgba(15, 23, 42, 0.1);
  }
`;

export const Line = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
`;

export const Row = styled.div`
  height: 52px;
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 10px 0;
    gap: 6px;
  }
`;

export const Key = styled.div`
  font-size: 13px;
  color: rgba(15, 23, 42, 0.7);
`;

export const ValueInput = styled.input`
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0 12px;
  font-weight: 700;
  color: #0f172a;
  outline: none;

  &::placeholder {
    color: rgba(15, 23, 42, 0.35);
    font-weight: 600;
  }

  &:focus {
    border-color: rgba(37, 99, 235, 0.55);
  }
`;

export const SaveBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LogoutBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: #dc2626;
  color: white;
  font-weight: 800;
  cursor: pointer;
  margin-left: 12px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Note = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
`;
