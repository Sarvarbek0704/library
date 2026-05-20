import { useLocation } from "react-router-dom";
import useSuperadminNavigation from "../../../hooks/useSuperadminNavigation";
import {
  SidebarWrap,
  Brand,
  BrandIcon,
  BrandText,
  Nav,
  NavItem,
  IconBox,
  Label,
} from "../../Sidebar/Sidebar.styled";

import {
  IoShieldCheckmarkOutline,
  IoAnalyticsOutline,
  IoPersonCircleOutline,
  IoPeopleOutline,
  IoCreateOutline,
  IoBusinessOutline,
  IoGridOutline,
  IoCardOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoStatsChartOutline,
  IoLibraryOutline,
  IoBookOutline,
} from "react-icons/io5";

export default function SuperadminSidebar() {
  const { pathname } = useLocation();

  const {
    goToSuperadmin,
    goToAuthorsSuperadmin,
    goToAdmin,
    goToLibrariesSuperadmin,
    goToUsersSuperadmin,
    goToCategoriesSuperadmin,
    goToMembershipsSuperadmin,
    goToMembersSuperadmin,
    goToPaymentsSuperadmin,
    goToMemberStatsSuperadmin,
    goToBooksSuperadmin,
  } = useSuperadminNavigation();

  const active = (path: string) => pathname === path;

  const isSuperadminHome = active("/superadmin");
  const isAdmin = active("/superadmin/admin");
  const isAuthors = active("/superadmin/authors");
  const isLibraries = active("/superadmin/libraries");
  const isUsers = active("/superadmin/users");
  const isCategories = active("/superadmin/categories");
  const isMemberships = active("/superadmin/memberships");
  const isMembers = active("/superadmin/members");
  const isPayments = active("/superadmin/payments");
  const isMemberStats = active("/superadmin/member-stats");
  const isBooks = active("/superadmin/books");

  return (
    <SidebarWrap>
      <Brand>
        <BrandIcon>
          <IoShieldCheckmarkOutline size={22} />
        </BrandIcon>
        <BrandText onClick={goToSuperadmin}>Superadmin Portal</BrandText>
      </Brand>

      <Nav>
        <NavItem $active={isSuperadminHome} onClick={goToSuperadmin}>
          <IconBox $active={isSuperadminHome}>
            <IoAnalyticsOutline size={20} />
          </IconBox>
          <Label>Dashboard</Label>
        </NavItem>

        <NavItem $active={isAdmin} onClick={goToAdmin}>
          <IconBox $active={isAdmin}>
            <IoPersonCircleOutline size={20} />
          </IconBox>
          <Label>Admin</Label>
        </NavItem>

        <NavItem $active={isUsers} onClick={goToUsersSuperadmin}>
          <IconBox $active={isUsers}>
            <IoPeopleOutline size={20} />
          </IconBox>
          <Label>Users</Label>
        </NavItem>

        <NavItem $active={isAuthors} onClick={goToAuthorsSuperadmin}>
          <IconBox $active={isAuthors}>
            <IoCreateOutline size={20} />
          </IconBox>
          <Label>Authors</Label>
        </NavItem>

        <NavItem $active={isLibraries} onClick={goToLibrariesSuperadmin}>
          <IconBox $active={isLibraries}>
            <IoBusinessOutline size={20} />
          </IconBox>
          <Label>Libraries</Label>
        </NavItem>

        <NavItem $active={isCategories} onClick={goToCategoriesSuperadmin}>
          <IconBox $active={isCategories}>
            <IoGridOutline size={20} />
          </IconBox>
          <Label>Categories</Label>
        </NavItem>

        <NavItem $active={isMemberships} onClick={goToMembershipsSuperadmin}>
          <IconBox $active={isMemberships}>
            <IoCardOutline size={20} />
          </IconBox>
          <Label>Memberships</Label>
        </NavItem>

        <NavItem $active={isMembers} onClick={goToMembersSuperadmin}>
          <IconBox $active={isMembers}>
            <IoPersonOutline size={20} />
          </IconBox>
          <Label>Members</Label>
        </NavItem>

        <NavItem $active={isPayments} onClick={goToPaymentsSuperadmin}>
          <IconBox $active={isPayments}>
            <IoWalletOutline size={20} />
          </IconBox>
          <Label>Payments</Label>
        </NavItem>

        <NavItem $active={isMemberStats} onClick={goToMemberStatsSuperadmin}>
          <IconBox $active={isMemberStats}>
            <IoStatsChartOutline size={20} />
          </IconBox>
          <Label>Member Stats</Label>
        </NavItem>

        <NavItem $active={isBooks} onClick={goToBooksSuperadmin}>
          <IconBox $active={isBooks}>
            <IoLibraryOutline size={20} />
          </IconBox>
          <Label>Books</Label>
        </NavItem>
      </Nav>
    </SidebarWrap>
  );
}
