import { useLocation } from "react-router";

export const useCurrentRoute = () => {
  const location = useLocation();
  return location.pathname.split("/")[1];
};
