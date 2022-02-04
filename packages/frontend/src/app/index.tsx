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

const StyledBox = styled(Box)<AppTheme>(() => ({
  width: "100%",
  minHeight: "100vh",
  height: "100vh",
  maxHeight: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const Container = styled(Box)<AppTheme>(() => ({
  height: "100vh",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  transition: "padding-left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
  overflowX: "hidden",
  overflowY: "auto",
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
          <Container
            style={{
              paddingLeft:
                isMobile || !Store.ui.drawerOpened
                  ? "1rem"
                  : `calc(${Store.ui.drawerWidth}px + 1rem)`,
            }}
          >
            <StyledSeparator />
            <AppRouter />
          </Container>
        </StyledBox>
      </BrowserRouter>
    </ThemeProvider>
  );
});
