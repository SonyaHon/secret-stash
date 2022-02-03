import React from "react";
import { observer } from "mobx-react";
import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import { Store } from "../../store";
import { styled } from "@mui/styles";
import { AppTheme } from "../../app/theme";
import { ChevronLeft } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const DrawerHeader = styled("div")<AppTheme>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

export const LeftDrawer: React.FC = observer(() => {
  const location = useLocation();
  console.log("Location", location);

  return (
    <Drawer
      sx={{
        width: Store.ui.drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: Store.ui.drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={Store.ui.drawerOpened}
    >
      <DrawerHeader>
        <Typography variant="h6">Search</Typography>
        <IconButton size="large" onClick={() => Store.ui.toggleDrawer()}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
      <Divider />
    </Drawer>
  );
});
