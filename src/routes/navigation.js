import { Navigate } from "react-router-dom";

export const Navigation = (path) => {
    return <Navigate to={path} replace />;
};