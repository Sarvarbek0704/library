import styled from "styled-components";
import { Link } from "react-router-dom";
import colors from "../../styles/colors";

export const BookDetailsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const BookImage = styled.img`
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 280px;
    margin: 0 auto;
  }
`;

export const BookInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BookTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.text};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const BookAuthor = styled.p`
  font-size: 1.3rem;
  color: ${colors.gray500};
  font-weight: 500;
  margin: 0;
`;

export const BookDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${colors.text};
  margin: 0;
`;

export const BookMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const BookImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const BackLink = styled(Link)`
  font-size: 16px;
  color: ${colors.primary};
  text-decoration: none;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.hoverColor};
    color: ${colors.primary};
  }
`;

export const MetaItem = styled.div`
  font-size: 16px;
  color: ${colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

// New styled components for enhanced features
export const RatingSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const RatingStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ReviewsSection = styled.div`
  margin-top: 40px;
  width: 100%;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 24px;
  }
`;

export const ReviewCard = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const ReviewContent = styled.p`
  color: ${colors.text};
  line-height: 1.6;
  margin: 0;
`;

export const SimilarBooksSection = styled.div`
  margin-top: 40px;
  width: 100%;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 24px;
  }
`;

export const SimilarBooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

export const SimilarBookCard = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  h4 {
    margin: 12px 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${colors.text};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p {
    margin: 0;
    color: ${colors.gray500};
    font-size: 14px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
`;

export const SaveButton = styled.button<{ $saved?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  border: 2px solid
    ${(props) => (props.$saved ? colors.danger : colors.primary)};
  background: ${(props) => (props.$saved ? colors.danger : colors.white)};
  color: ${(props) => (props.$saved ? colors.white : colors.primary)};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$saved ? colors.dangerHover : colors.hoverColor};
    border-color: ${(props) =>
      props.$saved ? colors.dangerHover : colors.primary};
  }
`;

export const BorrowButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.hoverColor};
    color: ${colors.primary};
  }
`;

export const ReviewForm = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: ${colors.text};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 24px 0;
`;

export const StatsCard = styled.div`
  background: ${colors.white};
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;
