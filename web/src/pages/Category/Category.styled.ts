import styled from "styled-components";
import colors from "../../styles/colors";

export const CategoryWrapper = styled.div`
  min-height: 100vh;
  padding: 24px;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

export const CategoryCard = styled.div`
  background: ${colors.white};
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${colors.primary};
    transform: translateY(-2px);
  }
`;

export const CategoryTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.black};
`;

export const CategoryDesc = styled.p`
  font-size: 14px;
  color: ${colors.gray500};
  margin: 0 0 12px;
  line-height: 1.4;
`;

export const CountText = styled.div`
  font-size: 14px;
  color: ${colors.text};
  font-weight: 600;
`;

export const BooksSection = styled.div`
  margin-top: 28px;
  background: ${colors.white};
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

/* =========================
   BOOK CARD (Books page style)
   ========================= */

export const BookCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    transform: translateY(-2px);
  }
`;

export const BookContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const BookActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

export const BookImg = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const BookTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;

  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;
  word-break: break-word;

  /* ✅ 2 qator to‘liq ko‘rinsin (kesilib qolmasin) */
  min-height: calc(1.35em * 2);
  max-height: calc(1.35em * 2);
  padding: 2px 0;
`;

export const BookMeta = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #666;
  gap: 2px;
  margin-top: auto;
  padding-top: 8px;
`;
