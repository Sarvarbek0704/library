import { useLocation } from "react-router-dom";
import useAdminNavigation from "../hooks/useAdminNavigation";
import {
  SidebarWrap,
  Brand,
  BrandIcon,
  BrandText,
  Nav,
  NavItem,
  IconBox,
  Label,
} from "./Sidebar/Sidebar.styled";

import {
  IoAnalyticsOutline,
  IoCreateOutline,
  IoPeopleOutline,
  IoGridOutline,
  IoCardOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoStatsChartOutline,
  IoLibraryOutline,
  IoReturnDownBackOutline,
  IoBookOutline,
} from "react-icons/io5";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const {
    goToAdmin,
    goToAuthorsAdmin,
    goToUsersAdmin,
    goToCategoriesAdmin,
    goToMembershipsAdmin,
    goToMembersAdmin,
    goToPaymentsAdmin,
    goToMemberStatsAdmin,
    goToBooksAdmin,
    goToReturnRequestAdmin,
  } = useAdminNavigation();

  const active = (path: string) => pathname === path;

  return (
    <SidebarWrap>
      <Brand>
        <BrandIcon>
          <IoBookOutline size={22} />
        </BrandIcon>
        <BrandText onClick={goToAdmin}>Library Admin</BrandText>
      </Brand>

      <Nav>
        <NavItem $active={active("/admin")} onClick={goToAdmin}>
          <IconBox $active={active("/admin")}>
            <IoAnalyticsOutline size={20} />
          </IconBox>
          <Label>Dashboard</Label>
        </NavItem>

        <NavItem $active={active("/admin/authors")} onClick={goToAuthorsAdmin}>
          <IconBox $active={active("/admin/authors")}>
            <IoCreateOutline size={20} />
          </IconBox>
          <Label>Authors</Label>
        </NavItem>

        <NavItem $active={active("/admin/users")} onClick={goToUsersAdmin}>
          <IconBox $active={active("/admin/users")}>
            <IoPeopleOutline size={20} />
          </IconBox>
          <Label>Users</Label>
        </NavItem>

        <NavItem
          $active={active("/admin/categories")}
          onClick={goToCategoriesAdmin}
        >
          <IconBox $active={active("/admin/categories")}>
            <IoGridOutline size={20} />
          </IconBox>
          <Label>Categories</Label>
        </NavItem>

        <NavItem
          $active={active("/admin/memberships")}
          onClick={goToMembershipsAdmin}
        >
          <IconBox $active={active("/admin/memberships")}>
            <IoCardOutline size={20} />
          </IconBox>
          <Label>Memberships</Label>
        </NavItem>

        <NavItem $active={active("/admin/members")} onClick={goToMembersAdmin}>
          <IconBox $active={active("/admin/members")}>
            <IoPersonOutline size={20} />
          </IconBox>
          <Label>Members</Label>
        </NavItem>

        <NavItem
          $active={active("/admin/payments")}
          onClick={goToPaymentsAdmin}
        >
          <IconBox $active={active("/admin/payments")}>
            <IoWalletOutline size={20} />
          </IconBox>
          <Label>Payments</Label>
        </NavItem>

        <NavItem
          $active={active("/admin/member-stats")}
          onClick={goToMemberStatsAdmin}
        >
          <IconBox $active={active("/admin/member-stats")}>
            <IoStatsChartOutline size={20} />
          </IconBox>
          <Label>Member Stats</Label>
        </NavItem>

        <NavItem $active={active("/admin/books")} onClick={goToBooksAdmin}>
          <IconBox $active={active("/admin/books")}>
            <IoLibraryOutline size={20} />
          </IconBox>
          <Label>Books</Label>
        </NavItem>

        <NavItem
          $active={active("/admin/return_requests")}
          onClick={goToReturnRequestAdmin}
        >
          <IconBox $active={active("/admin/return_requests")}>
            <IoReturnDownBackOutline size={20} />
          </IconBox>
          <Label>Return Requests</Label>
        </NavItem>
      </Nav>
    </SidebarWrap>
  );
}
