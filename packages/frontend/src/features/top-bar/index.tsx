import React from "react";
import { observer } from "mobx-react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Store } from "../../store";

export const TopBar: React.FC = observer(() => {
  return (
    <Box>
      <AppBar
        position="fixed"
        style={{
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          width: Store.ui.drawerOpened
            ? `calc(100% - ${Store.ui.drawerWidth}px)`
            : "100%",
        }}
      >
        <Toolbar>
          {!Store.ui.drawerOpened && (
            <IconButton
              size="large"
              color="inherit"
              edge="start"
              aria-lable="menu"
              sx={{ mr: 2 }}
              onClick={() => Store.ui.toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography sx={{ flexGrow: 1 }} variant="h6">
            Secret Stash
          </Typography>

          <Button size="large" color="inherit">
            videos
          </Button>
          <Button size="large" color="inherit">
            actors
          </Button>
          <Button size="large" color="inherit">
            collections
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
});
