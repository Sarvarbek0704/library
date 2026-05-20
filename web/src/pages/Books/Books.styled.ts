import styled from "styled-components";

export const BooksWrapper = styled.div`
  padding: 24px;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

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
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

export const BookContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow flex item to shrink */
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

  /* ✅ 2 qator to‘liq ko‘rinsin, kesilmasin */
  min-height: calc(1.35em * 2);
  max-height: calc(1.35em * 2);

  /* ✅ font kesilib qolishini oldini oladi */
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

export const SearchWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  align-items: center;
`;
