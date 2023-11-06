import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth.js";

function ProtectedRoute({children, redirectPath = "/connexion"}) {
  const {accessToken} = useAuth()

  if (!accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node,
}

export default ProtectedRoute;