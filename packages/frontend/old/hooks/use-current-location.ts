import { useLocation } from "react-router-dom";

export const useCurrentLocation = () => {
  const location = useLocation();
  return location.pathname.split("/")[1];
};
