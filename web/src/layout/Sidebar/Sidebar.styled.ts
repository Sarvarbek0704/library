import styled from "styled-components";

export const SidebarWrap = styled.aside`
  width: 260px; 
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #eef2f8;
  padding: 18px 16px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
`;


export const Brand = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px 8px;
  margin-bottom: 18px;

  text-align: left;
`;

export const BrandIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2f6df6;

  display: grid;
  place-items: center;

  img {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1); 
  }
`;

export const BrandText = styled.div`
  font-weight: 900;
  color: #0f172a;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
`;

export const NavItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  height: 44px;
  border-radius: 22px;
  border: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 0 14px;

  background: ${(p) => (p.$active ? "#EAF2FF" : "transparent")};

  &:hover {
    background: ${(p) => (p.$active ? "#EAF2FF" : "#F5F8FF")};
  }

  &:active {
    transform: translateY(0.5px);
  }
`;

export const IconBox = styled.span<{ $active?: boolean }>`
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;

  color: ${(p) => (p.$active ? "#2F6DF6" : "#94A3B8")};

  svg {
    width: 20px;
    height: 20px;
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

export const Label = styled.span<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => (p.$active ? "#2F6DF6" : "#64748B")};
`;