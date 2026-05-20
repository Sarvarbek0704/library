import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(18px); opacity: .7; }
  to   { transform: translateX(0); opacity: 1; }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(9, 12, 18, 0.55);
  backdrop-filter: blur(6px);
  z-index: 999;
  animation: ${fadeIn} 160ms ease-out;
`;

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;

  width: 100vw;   /* 100% ekran */
  height: 100vh;

  background: #0f172a;
  color: #e5e7eb;
  z-index: 1000;

  display: flex;
  flex-direction: column;

  border-left: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${slideIn} 180ms ease-out;
`;

export const DrawerHeader = styled.div`
  height: 70px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.2px;
`;

export const CloseBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const DrawerBody = styled.div`
  flex: 1;
  padding: 18px;
  overflow: auto;
`;

export const DrawerFooter = styled.div`
  padding: 14px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const AvatarWrap = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  flex: 0 0 auto;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 28px;
  color: #e5e7eb;
`;

export const UploadBtn = styled.button`
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 16px 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  color: rgba(229, 231, 235, 0.75);
`;

export const Input = styled.input`
  height: 44px;
  border-radius: 12px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.35);
  color: #e5e7eb;
  outline: none;

  &::placeholder {
    color: rgba(229, 231, 235, 0.38);
  }

  &:focus {
    border-color: rgba(99, 102, 241, 0.6);
  }

  &:read-only {
    opacity: 0.85;
    cursor: not-allowed;
  }
`;

export const Hint = styled.div`
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(229, 231, 235, 0.85);
`;

export const Small = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: rgba(229, 231, 235, 0.6);
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export type BtnVariant = "primary" | "ghost" | "danger";

export const Btn = styled.button<{ $variant?: BtnVariant }>`
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  color: #e5e7eb;

  border: 1px solid
    ${(p) =>
    p.$variant === "primary"
      ? "rgba(99, 102, 241, 0.75)"
      : p.$variant === "danger"
        ? "rgba(239, 68, 68, 0.65)"
        : "rgba(255, 255, 255, 0.12)"};

  background: ${(p) =>
    p.$variant === "primary"
      ? "rgba(99, 102, 241, 0.18)"
      : p.$variant === "danger"
        ? "rgba(239, 68, 68, 0.14)"
        : "rgba(255, 255, 255, 0.04)"};

  &:hover {
    background: ${(p) =>
    p.$variant === "primary"
      ? "rgba(99, 102, 241, 0.25)"
      : p.$variant === "danger"
        ? "rgba(239, 68, 68, 0.20)"
        : "rgba(255, 255, 255, 0.07)"};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
