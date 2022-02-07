import React, { useCallback, useMemo } from "react";
import { styled } from "@mui/styles";
import { Box, useMediaQuery } from "@mui/material";
import { AppTheme } from "./theme";
import { Store } from "../store";
import { useCurrentLocation } from "../hooks/use-current-location";
import { observer } from "mobx-react";

const Container = styled(Box)<AppTheme>(() => ({
  height: "100vh",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  transition: "padding-left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
  overflowX: "hidden",
  overflowY: "auto",
}));

export const AppContainer: React.FC = observer(({ children }) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  const currentLocation = useCurrentLocation();
  const drawerOpened = Store.ui.drawerOpened;

  const getPaddingValue = useCallback(() => {
    return isMobile ||
      !drawerOpened ||
      !["videos", "actors", "collections"].includes(currentLocation)
      ? "1rem"
      : `calc(${Store.ui.drawerWidth}px + 1rem)`;
  }, [isMobile, currentLocation, drawerOpened]);

  return (
    <Container
      style={{
        paddingLeft: getPaddingValue(),
      }}
    >
      {children}
    </Container>
  );
});
