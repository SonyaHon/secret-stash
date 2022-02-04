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
import {
  Collections,
  KeyboardBackspace,
  Person,
  VideoLibrary,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/styles";
import { AppTheme } from "../../app/theme";
import { useCurrentLocation } from "../../hooks/use-current-location";

export const TopBar: React.FC = observer(() => {
  const isMobile = useMediaQuery("(max-width:600px");
  const theme = useTheme<AppTheme>();
  const navigate = useNavigate();
  const currentLocation = useCurrentLocation();

  const genColors = useCallback(
    (route: string): { style: CSSProperties } => {
      return {
        style: {
          color:
            currentLocation === route
              ? theme.palette.primary.contrastText
              : theme.palette.primary.dark,
          ...(currentLocation !== route
            ? {
                filter: "brightness(0.7)",
              }
            : {}),
        },
      };
    },
    [currentLocation, theme.palette]
  );

  const backButtonRoutes = ["video", "actor", "collection", "upload"];
  const getBackwardsRoute = () => {
    switch (currentLocation) {
      case "video":
        return "/videos";
      case "actor":
        return "/actors";
      case "collection":
        return "/collections";
      default:
        return -1 as unknown as string;
    }
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        style={{
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          width:
            Store.ui.drawerOpened &&
            !isMobile &&
            ["videos", "actors", "collections"].includes(currentLocation)
              ? `calc(100% - ${Store.ui.drawerWidth}px)`
              : "100%",
        }}
      >
        <Toolbar>
          {(!Store.ui.drawerOpened || isMobile) &&
            !backButtonRoutes.includes(currentLocation) && (
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
          {backButtonRoutes.includes(currentLocation) ? (
            <IconButton
              size="large"
              color="inherit"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <KeyboardBackspace />
            </IconButton>
          ) : (
            <></>
          )}
          <Typography sx={{ flexGrow: "1" }} variant="h6">
            Secret Stash
          </Typography>

          <Link {...genColors("videos")} to="/videos">
            <IconButton aria-label="videos" size="large" color="inherit">
              <VideoLibrary />
            </IconButton>
          </Link>
          <Link {...genColors("actors")} to="/actors">
            <IconButton aria-label="actors" size="large" color="inherit">
              <Person />
            </IconButton>
          </Link>
          <Link {...genColors("collections")} to="/collections">
            <IconButton aria-label="collections" size="large" color="inherit">
              <Collections />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
});
