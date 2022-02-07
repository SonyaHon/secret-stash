import React from "react";
import { styled, ThemeProvider } from "@mui/styles";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { TopBar } from "../features/top-bar";
import { AppRouter } from "./router";
import { LeftDrawer } from "../features/left-drawer";
import { AppTheme, appTheme } from "./theme";
import { MobileDrawer } from "../features/mobile-drawer";
import { Store } from "../store";
import { observer } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentLocation } from "../hooks/use-current-location";
import { AppContainer } from "./container";

const StyledBox = styled(Box)<AppTheme>(() => ({
  width: "100%",
  minHeight: "100vh",
  height: "100vh",
  maxHeight: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const StyledSeparator = styled(Box)<AppTheme>(({ theme }) => ({
  marginBottom: "1rem",
  ...theme.mixins.toolbar,
}));

export const App: React.FC = observer(() => {
  const isMobile = useMediaQuery("(max-width:500px)");

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <StyledBox>
          <TopBar />
          {!isMobile ? <LeftDrawer /> : <MobileDrawer />}
          <AppContainer>
            <StyledSeparator />
            <AppRouter />
          </AppContainer>
        </StyledBox>
      </BrowserRouter>
    </ThemeProvider>
  );
});
