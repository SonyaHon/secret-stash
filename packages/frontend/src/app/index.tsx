import React from "react";
import { styled, ThemeProvider } from "@mui/styles";
import { Box, CssBaseline } from "@mui/material";
import { TopBar } from "../features/top-bar";
import { AppRouter } from "./router";
import { LeftDrawer } from "../features/left-drawer";
import { AppTheme, appTheme } from "./theme";

const StyledBox = styled(Box)<AppTheme>(({ theme }) => ({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
}));

export const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <StyledBox>
          <TopBar />
          <Box>
            <LeftDrawer />
            <AppRouter />
          </Box>
        </StyledBox>
      </ThemeProvider>
    </>
  );
};
