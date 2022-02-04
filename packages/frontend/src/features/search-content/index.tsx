import React from "react";
import { observer } from "mobx-react";
import { Videos } from "./videos";
import { useCurrentLocation } from "../../hooks/use-current-location";

const Components = {
  videos: <Videos />,
} as Record<string, React.ReactNode>;

export const SearchContent: React.FC = observer(() => {
  const path = useCurrentLocation();
  return <>{Components[path]}</>;
});
