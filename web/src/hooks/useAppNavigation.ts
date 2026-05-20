import { useNavigate } from "react-router-dom";
import type { Membership } from "../types/membership";

function useAppNavigation() {
  const navigate = useNavigate();
  return {
    goToHome: () => navigate("/"),
    goToCategory: () => navigate("/category"),
    goToReadingHistory: () => navigate("/reading_history"),
    goToSavedBooks: () => navigate("/saved_books"),
    goToMembership: () => navigate("/membership"),
    goToPayment: (plan: Membership) => {
      navigate("/payment", { state: { plan } });
    },
    goToBooks: () => navigate("/books"),
    goToProfile: () => navigate("/profile"),
  };
}

export default useAppNavigation;
