import React, { CSSProperties, useCallback } from "react";
import { observer } from "mobx-react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Store } from "../../store";
import { Collections, Person, VideoLibrary } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/styles";
import { AppTheme } from "../../app/theme";

export const TopBar: React.FC = observer(() => {
  const isMobile = useMediaQuery("(max-width:600px");
  const location = useLocation();
  const theme = useTheme<AppTheme>();

  const genColors = useCallback(
    (route: string): { style: CSSProperties } => {
      return {
        style: {
          color:
            location.pathname === route
              ? theme.palette.primary.contrastText
              : theme.palette.primary.dark,
          ...(location.pathname !== route
            ? {
                filter: "brightness(0.7)",
              }
            : {}),
        },
      };
    },
    [location, theme.palette]
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        style={{
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          width:
            Store.ui.drawerOpened && !isMobile
              ? `calc(100% - ${Store.ui.drawerWidth}px)`
              : "100%",
        }}
      >
        <Toolbar>
          {(!Store.ui.drawerOpened || isMobile) && (
            <IconButton
              size="large"
              color="inherit"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => Store.ui.toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography sx={{ flexGrow: "1" }} variant="h6">
            Secret Stash
          </Typography>

          <IconButton aria-label="videos" size="large" color="inherit">
            <Link {...genColors("/videos")} to="/videos">
              <VideoLibrary />
            </Link>
          </IconButton>
          <IconButton aria-label="actors" size="large" color="inherit">
            <Link {...genColors("/actors")} to="/actors">
              <Person />
            </Link>
          </IconButton>
          <IconButton aria-label="collections" size="large" color="inherit">
            <Link {...genColors("/collections")} to="/collections">
              <Collections />
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
});
