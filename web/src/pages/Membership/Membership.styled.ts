import styled from "styled-components";

export const Page = styled.div`
  padding: 28px;
  max-width: 1180px;
  margin: 0 auto;
`;

export const Info = styled.div`
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 16px;
  color: #111827;
  font-weight: 800;
`;

export const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1080px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Card = styled.div`
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%);
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  transition: 0.22s ease;

  /* MUHIM: hamma card balandligi bir xil bo‘lsin */
  min-height: 520px;

  /* MUHIM: ichidagi elementlarni ustun qilib joylash */
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.10);
    border-color: #d1d5db;
  }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 22px;
    pointer-events: none;
    background: radial-gradient(
      650px 260px at 20% 0%,
      rgba(37, 99, 235, 0.10),
      transparent 55%
    );
    opacity: 0;
    transition: 0.22s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

export const CardTop = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
`;

export const PlanName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 950;
  color: #0b1220;
  letter-spacing: -0.01em;
`;

export const PlanDesc = styled.p<{ $expanded?: boolean }>`
  margin: 8px 0 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #4b5563;

  /* MUHIM: uzun description layoutni buzmasin */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* expanded bo‘lmasa 3 qator */
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : 3)};
`;

export const DescActions = styled.div`
  margin-top: 8px;
`;

export const DescToggle = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8; /* ko‘k */
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const Badge = styled.span<{ variant?: "popular" | "best" | "plan" }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  background: ${({ variant }) =>
    variant === "best"
      ? "linear-gradient(135deg, #111827, #0b1220)"
      : variant === "popular"
        ? "linear-gradient(135deg, #1d4ed8, #0b3aa8)"
        : "linear-gradient(135deg, #0b1220, #111827)"};

  color: #fff;

  &:before {
    content: "●";
    font-size: 10px;
    opacity: 0.9;
  }
`;

export const PriceRow = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

export const Price = styled.div`
  font-size: 34px;
  font-weight: 1000;
  color: #0b1220;
  letter-spacing: -0.02em;
`;

export const PriceHint = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
`;

export const Divider = styled.div`
  margin: 14px 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
`;

export const Stats = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const Stat = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px 12px;
  background: #ffffff;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
`;

export const StatValue = styled.div`
  margin-top: 5px;
  font-size: 15px;
  font-weight: 950;
  color: #0b1220;
`;

/* MUHIM: pastki qismni doim pastga yopishtiramiz */
export const CardBottom = styled.div`
  margin-top: auto;
`;

export const ChooseButton = styled.button`
  margin-top: 16px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid #0b1220;
  background: #0b1220;
  color: white;
  font-weight: 950;
  cursor: pointer;
  transition: 0.2s ease;
  letter-spacing: 0.2px;

  &:hover {
    transform: translateY(-1px);
    background: #111827;
  }

  &:active {
    transform: translateY(0px) scale(0.99);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.18);
  }
`;

export const Note = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 800;
`;

