import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const Left = styled.div`
  flex: 1;
`;

export const Center = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

export const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const SignOutButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background: darkred;
  }
`;

export const AdminImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  border: 2px solid #e0e0e0;
  display: grid;
  place-items: center;
`;

export const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #0f172a;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 16px;
`;
