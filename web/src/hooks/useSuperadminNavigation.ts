import { useNavigate } from "react-router-dom";

function useSuperadminNavigation() {
    const navigate = useNavigate();
    return {
        goToAuthorsSuperadmin: () => navigate("/superadmin/authors"),
        goToSuperadmin: () => navigate("/superadmin"),
        goToAdmin: () => navigate("/superadmin/admin"),
        goToLibrariesSuperadmin: () => navigate("/superadmin/libraries"),
        goToUsersSuperadmin: () => navigate("/superadmin/users"),
        goToCategoriesSuperadmin: () => navigate("/superadmin/categories"),
        goToMembershipsSuperadmin: () => navigate("/superadmin/memberships"),
        goToMembersSuperadmin: () => navigate("/superadmin/members"),
        goToPaymentsSuperadmin: () => navigate("/superadmin/payments"),
        goToMemberStatsSuperadmin: () => navigate("/superadmin/member-stats"),
        goToBooksSuperadmin: () => navigate("/superadmin/books"),
        goToLogin: () => navigate("/login")
    };
}

export default useSuperadminNavigation;
