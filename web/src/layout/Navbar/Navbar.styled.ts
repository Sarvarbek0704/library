import styled from "styled-components";

export const NavbarWrap = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #eaf0fb;
`;

export const NavbarInner = styled.div`
  height: 80px;
  display: flex;
  align-items: center;

  width: 100%;
  padding: 0 22px;
`;

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;
