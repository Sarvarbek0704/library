import { useNavigate } from "react-router-dom";

function useAdminNavigation() {
  const navigate = useNavigate();
  return {
    goToAuthorsAdmin: () => navigate("/admin/authors"),
    goToAdmin: () => navigate("/admin"),
    goToLibrariesAdmin: () => navigate("/admin/libraries"),
    goToUsersAdmin: () => navigate("/admin/users"),
    goToCategoriesAdmin: () => navigate("/admin/categories"),
    goToMembershipsAdmin: () => navigate("/admin/memberships"),
    goToMembersAdmin: () => navigate("/admin/members"),
    goToPaymentsAdmin: () => navigate("/admin/payments"),
    goToMemberStatsAdmin: () => navigate("/admin/member-stats"),
    goToBooksAdmin: () => navigate("/admin/books"),
    goToReturnRequestAdmin: () => navigate("/admin/return_requests"),
    goToLogin: () => navigate("/login")
  };
}

export default useAdminNavigation;
