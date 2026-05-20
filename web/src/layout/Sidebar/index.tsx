import { useLocation } from "react-router-dom";
import useAppNavigation from "../../hooks/useAppNavigation";

import {
  IoHomeOutline,
  IoLibraryOutline,
  IoGridOutline,
  IoTimeOutline,
  IoHeartOutline,
  IoPersonCircleOutline,
  IoDiamondOutline,
  IoBookOutline,
} from "react-icons/io5";

import {
  SidebarWrap,
  Brand,
  BrandIcon,
  BrandText,
  Nav,
  NavItem,
  IconBox,
  Label,
} from "./Sidebar.styled";

export default function Sidebar() {
  const { pathname } = useLocation();

  const {
    goToHome,
    goToCategory,
    goToReadingHistory,
    goToSavedBooks,
    goToMembership,
    goToBooks,
    goToProfile,
  } = useAppNavigation();

  const isDashboard = pathname === "/" || pathname === "/dashboard";
  const isBooks = pathname.startsWith("/books");
  const isCategory = pathname.startsWith("/category");
  const isHistory = pathname.startsWith("/reading_history");
  const isSaved = pathname.startsWith("/saved_books");
  const isMembership = pathname.startsWith("/membership");
  const isProfile = pathname.startsWith("/profile");

  return (
    <SidebarWrap>
      <Brand onClick={goToHome} type="button" aria-label="Go to dashboard">
        <BrandIcon aria-hidden="true">
          <IoBookOutline size={22} />
        </BrandIcon>
        <BrandText>LibraryPortal</BrandText>
      </Brand>

      <Nav>
        <NavItem $active={isDashboard} onClick={goToHome} type="button">
          <IconBox $active={isDashboard}>
            <IoHomeOutline size={20} />
          </IconBox>
          <Label $active={isDashboard}>Dashboard</Label>
        </NavItem>

        <NavItem $active={isBooks} onClick={goToBooks} type="button">
          <IconBox $active={isBooks}>
            <IoLibraryOutline size={20} />
          </IconBox>
          <Label $active={isBooks}>Books</Label>
        </NavItem>

        <NavItem $active={isCategory} onClick={goToCategory} type="button">
          <IconBox $active={isCategory}>
            <IoGridOutline size={20} />
          </IconBox>
          <Label $active={isCategory}>Category</Label>
        </NavItem>

        <NavItem $active={isHistory} onClick={goToReadingHistory} type="button">
          <IconBox $active={isHistory}>
            <IoTimeOutline size={20} />
          </IconBox>
          <Label $active={isHistory}>Reading History</Label>
        </NavItem>

        <NavItem $active={isSaved} onClick={goToSavedBooks} type="button">
          <IconBox $active={isSaved}>
            <IoHeartOutline size={20} />
          </IconBox>
          <Label $active={isSaved}>Saved Books</Label>
        </NavItem>

        <NavItem $active={isProfile} onClick={goToProfile} type="button">
          <IconBox $active={isProfile}>
            <IoPersonCircleOutline size={20} />
          </IconBox>
          <Label $active={isProfile}>Profile</Label>
        </NavItem>

        <NavItem $active={isMembership} onClick={goToMembership} type="button">
          <IconBox $active={isMembership}>
            <IoDiamondOutline size={20} />
          </IconBox>
          <Label $active={isMembership}>Membership</Label>
        </NavItem>
      </Nav>
    </SidebarWrap>
  );
}
