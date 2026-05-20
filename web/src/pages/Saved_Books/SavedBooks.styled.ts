import styled from "styled-components";
import colors from "../../styles/colors";

export const SavedBooksWrapper = styled.div`
  padding: 24px;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.text};
  margin: 0 0 8px 0;
`;

export const Subtitle = styled.p`
  color: ${colors.gray500};
  font-size: 16px;
  margin: 0;
`;

export const SavedBooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

export const BookCard = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${colors.danger};
  color: ${colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);

  ${BookCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: ${colors.dangerHover};
  }

  svg {
    font-size: 16px;
  }
`;

export const BookImg = styled.img`
  width: 100%;
  height: 320px;
  object-fit: contain;          
  background: #f3f6fb;         
  border-radius: 12px;
  margin-bottom: 16px;
  display: block;
`;

export const BookTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`;

export const BookAuthor = styled.p`
  font-size: 14px;
  color: ${colors.gray500};
  margin: 0 0 4px 0;
  font-weight: 500;
`;

export const BookCategory = styled.span`
  display: inline-block;
  background: ${colors.hoverColor};
  color: ${colors.primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const BookMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #eef2f7;
`;

export const LibraryName = styled.span`
  font-size: 13px;
  color: ${colors.gray500};
  font-weight: 500;
`;

export const SavedDate = styled.span`
  font-size: 12px;
  color: ${colors.secondary};
  font-weight: 600;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${colors.gray500};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h2`
  font-size: 24px;
  color: ${colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  margin: 0 0 32px 0;
`;

export const BrowseButton = styled.button`
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.hoverColor};
    color: ${colors.primary};
  }
`;
