import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(900px 420px at 18% 0%, rgba(255, 255, 255, 0.06), transparent 55%),
    radial-gradient(700px 380px at 85% 10%, rgba(96, 165, 250, 0.08), transparent 60%),
    #0b0f14;
  color: #e5e7eb;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 22px 60px;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

export const BackBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -0.01em;
  color: #f3f4f6;
`;

export const Layout = styled.div`
  display: grid;
  gap: 22px;
  grid-template-columns: 1fr;

  @media (min-width: 980px) {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
  }
`;

export const Panel = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);

  min-height: 680px;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.div`
  font-weight: 950;
  color: #e5e7eb;
  font-size: 12px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  margin: 6px 0 12px;
`;

export const FieldGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const TwoCols = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Field = styled.div`
  position: relative;
`;

export const Label = styled.div`
  font-size: 12px;
  color: rgba(148, 163, 184, 0.85);
  font-weight: 750;
  margin: 0 0 6px;
`;

/* input look – library style */
export const Input = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.03);
  color: #e5e7eb;
  padding: 0 14px;
  outline: none;
  transition: 0.2s ease;

  &::placeholder {
    color: rgba(148, 163, 184, 0.60);
    font-weight: 650;
  }

  &:focus {
    border-color: rgba(96, 165, 250, 0.65);
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.03);
  color: #e5e7eb;
  padding: 0 14px;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: rgba(96, 165, 250, 0.65);
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
    background: rgba(255, 255, 255, 0.04);
  }

  option {
    background: #0b0f14;
    color: #e5e7eb;
  }
`;

export const Divider = styled.div`
  height: 1px;
  margin: 14px 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(148, 163, 184, 0.22),
    transparent
  );
`;

/* ================= RIGHT SUMMARY ================= */

export const SummaryTitle = styled.div`
  font-size: 20px;
  font-weight: 950;
  color: #f3f4f6;
  margin: 2px 0 8px;
`;

export const SummarySub = styled.div<{ $expanded?: boolean }>`
  font-size: 12px;
  color: rgba(148, 163, 184, 0.95);
  font-weight: 700;
  line-height: 1.7;
  margin-bottom: 10px;

  /* clamp */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : 3)};
`;

export const SmallLinkBtn = styled.button`
  border: none;
  background: transparent;
  color: rgba(96, 165, 250, 0.95);
  font-weight: 900;
  font-size: 12px;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

/* features */
export const FeatureList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
`;

export const Feature = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.55;
`;

export const Dot = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex: 0 0 auto;
`;

/* price table */
export const PriceTable = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 6px;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #cbd5e1;
  font-size: 13px;
`;

export const PriceStrong = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-weight: 1000;
  color: #f3f4f6;
  margin-top: 2px;

  div:last-child {
    font-size: 18px;
    letter-spacing: -0.01em;
  }
`;

/* right panel bottom (button+status+note) always bottom */
export const SummaryBottom = styled.div`
  margin-top: auto;
  padding-top: 10px;
`;

/* better button (neutral) */
export const PayBtn = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: #f8fafc;
  color: #0b0f14;
  font-weight: 1000;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #ffffff;
  }

  &:active {
    transform: translateY(0px) scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SmallNote = styled.div`
  margin-top: 10px;
  color: rgba(148, 163, 184, 0.92);
  font-size: 11px;
  line-height: 1.6;
`;

export const StatusPill = styled.div<{ status: "PENDING" | "PAID" | "FAILED" }>`
  margin-top: 10px;
  display: inline-flex;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  border: 1px solid rgba(148, 163, 184, 0.20);

  background:
    ${({ status }) =>
    status === "PAID"
      ? "rgba(34,197,94,0.12)"
      : status === "FAILED"
        ? "rgba(239,68,68,0.12)"
        : "rgba(245,158,11,0.12)"};

  color: ${({ status }) =>
    status === "PAID"
      ? "#bbf7d0"
      : status === "FAILED"
        ? "#fecaca"
        : "#fde68a"};
`;

/* optional: card preview */
export const CardPreview = styled.div`
  margin-top: 10px;
  border-radius: 18px;
  padding: 14px 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
`;

export const CardPreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(226, 232, 240, 0.92);
  font-weight: 850;
  font-size: 12px;

  & + & {
    margin-top: 8px;
  }
`;

export const CardPreviewBig = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 950;
  letter-spacing: 0.12em;
  color: #f3f4f6;
`;
