import styled from "styled-components";

export const SIDEBAR_W = 260;

export const AppShell = styled.div`
  min-height: 100vh;
  background: #f6f9ff;
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  margin-left: ${SIDEBAR_W}px;
`;

export const Page = styled.main`
  padding: 22px 22px 36px;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
`;
