import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth sayfası için - login olmuşsa ana sayfaya yönlendir
export const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Diğer sayfalar için - login olmamışsa auth'a yönlendir
export const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};