import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";

// Gate for a route that only one role should see. Redirects a signed-out
// visitor to login, and a signed-in visitor with the wrong role to their own
// dashboard instead of leaking this page to them.
function RequireRole({ role, children }) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) return null;

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (user.role !== role) {
		const ownDashboard = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
		return <Navigate to={ownDashboard} replace />;
	}

	return children;
}

export default RequireRole;
