import styled from "styled-components";

export const MainWrapper = styled.div`
  max-width: 1232px;
  margin: 0 auto;
  padding: 24px 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f7faff;
  min-height: 100vh;

  .navbar {
    display: flex;
    gap: 12px;
    padding: 14px 16px;
    max-width: 980px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    align-items: center;
  }

  .inputWrapper {
    display: flex;
    width: 100%;
    align-items: center;
    position: relative;
  }

  .iconSearch {
    height: 20px;
    width: 20px;
    position: absolute;
    left: 12px;
    color: #9ca3af;
  }

  .input {
    width: 100%;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding-left: 40px;
    outline: none;
    font-size: 14px;
    transition: 0.15s ease;
  }

  .input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  .searchBtn {
    height: 42px;
    padding: 0 22px;
    background-color: #2563eb;
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: 0.15s ease;
  }

  .searchBtn:hover {
    filter: brightness(0.98);
  }

  .searchBtn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .header {
    margin-top: 8px;
    color: #6b7280;
    max-width: 980px;
  }

  .header h2 {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
  }

  .header p {
    margin: 6px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .list {
    max-width: 980px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .card {
    width: 100%;
    padding: 14px 16px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
    border: 1px solid #eef2ff;
  }

  .headercard {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cardHeader {
    display: flex;
    gap: 18px;
    font-weight: 800;
    text-transform: uppercase;
    color: #0f172a;
    letter-spacing: 0.4px;
  }

  .cardHeader h4 {
    margin: 0;
    font-size: 12px;
    color: #64748b;
  }

  .divider {
    border: none;
    border-top: 1px solid #eef2f7;
    margin: 10px 0;
  }

  .cardBody {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .body1 {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 320px;
  }

  .imgBox {
    height: 64px;
    width: 64px;
    border-radius: 14px;
    overflow: hidden;
    background: #f1f5f9;
    flex-shrink: 0;
    border: 1px solid #e2e8f0;
    display: grid;
    place-items: center;
  }

  .imgBox img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .noImg {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 700;
  }

  .name-status {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: #0f172a;
    min-width: 0;
  }

  .nameRow {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .muted {
    color: #64748b;
    font-size: 13px;
  }

  .rowPills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 2px;
  }

  .statusBadge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    width: fit-content;
  }

  .pending {
    background: rgba(245, 158, 11, 0.12);
    color: #b45309;
  }
  .accepted {
    background: rgba(34, 197, 94, 0.14);
    color: #15803d;
  }
  .rejected {
    background: rgba(239, 68, 68, 0.14);
    color: #b91c1c;
  }

  .stateBadge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    width: fit-content;
    border: 1px solid rgba(148, 163, 184, 0.35);
    background: rgba(241, 245, 249, 0.9);
    color: #334155;
  }

  .msBorrowed {
    background: rgba(37, 99, 235, 0.12);
    color: #1d4ed8;
    border-color: rgba(37, 99, 235, 0.25);
  }

  .msBooked {
    background: rgba(168, 85, 247, 0.12);
    color: #7c3aed;
    border-color: rgba(124, 58, 237, 0.25);
  }

  .msReturned {
    background: rgba(34, 197, 94, 0.14);
    color: #15803d;
    border-color: rgba(21, 128, 61, 0.25);
  }

  .msOther {
    background: rgba(100, 116, 139, 0.12);
    color: #334155;
    border-color: rgba(100, 116, 139, 0.25);
  }

  .mini {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 2px;
  }

  .dates {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: #64748b;
    justify-content: center;
    min-width: 190px;
  }

  .detailBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 6px;
  }

  .detailGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .detailItem {
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .detailItem .k {
    display: block;
    font-size: 12px;
    color: #64748b;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .detailItem .v {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: #0f172a;
    font-weight: 700;
  }

  .noteBox {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .noteBox h4 {
    margin: 0;
    font-size: 13px;
    color: #0f172a;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .noteInput {
    height: 52px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    outline: none;
    font-size: 14px;
    background: #fff;
    transition: 0.15s ease;
  }

  .noteInput:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn {
    border: none;
    padding: 10px 16px;
    border-radius: 12px;
    font-weight: 900;
    cursor: pointer;
    transition: 0.15s ease;
  }

  .accept {
    background: #22c55e;
    color: #fff;
  }

  .reject {
    background: #ef4444;
    color: #fff;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .iconDown {
    display: flex;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
    font-size: 18px;
    color: #334155;
  }

  .errorBox,
  .emptyBox {
    max-width: 980px;
    background: #fff;
    border-radius: 16px;
    padding: 14px 16px;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
    color: #64748b;
    border: 1px solid #fee2e2;
  }

  @media (max-width: 900px) {
    .cardBody {
      flex-direction: column;
      align-items: stretch;
    }
    .dates {
      min-width: 0;
    }
    .detailGrid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .navbar {
      flex-direction: column;
      align-items: stretch;
      max-width: 100%;
    }
    .searchBtn {
      width: 100%;
    }
    .list {
      max-width: 100%;
    }
  }
`;
