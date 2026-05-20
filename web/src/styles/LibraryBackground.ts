import styled from "styled-components";

export const PageBg = styled.div<{ $image: string }>`
  min-height: 100vh;
  width: 100%;
  position: relative;

  /* background image */
  background-image: url(${(p) => p.$image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* center content */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;

  /* overlay + blur effect like login */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(2, 6, 23, 0.55); /* qoramtir */
    backdrop-filter: blur(6px);
  }

  /* content must stay above overlay */
  > * {
    position: relative;
    z-index: 1;
  }
`;
