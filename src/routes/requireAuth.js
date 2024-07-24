import { Navigation } from "./navigation";

export const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Navigation('/login');
  }
  return children;
};