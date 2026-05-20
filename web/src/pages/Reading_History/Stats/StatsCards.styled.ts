import styled from "styled-components";
import colors from "../../../styles/colors";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const Card = styled.div`
  background: ${colors.white};
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const IconBox = styled.div<{ $tone: "blue" | "amber" | "red" }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;

  background: ${(p) =>
    p.$tone === "blue"
      ? colors.hoverColor
      : p.$tone === "amber"
        ? "#fff7ed"
        : colors.dangerHover};

  svg {
    font-size: 22px;
    color: ${(p) =>
    p.$tone === "blue"
      ? colors.primary
      : p.$tone === "amber"
        ? colors.secondary
        : colors.danger};
  }
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: #334155;
`;

export const Value = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
`;

export const RightIcon = styled.div`
  margin-left: auto;
  color: #cbd5e1;

  svg {
    font-size: 18px;
  }
`;
