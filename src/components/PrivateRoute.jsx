import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wraps protected routes.
 * - While the initial auth check is in progress (cookie → /users/me/), shows a spinner.
 * - If the user is not authenticated after the check, redirects to /auth.
 * - Otherwise renders children normally.
 */
const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-[#FAD800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
