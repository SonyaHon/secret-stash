import React from "react";
import { observer } from "mobx-react";
import { Divider, Drawer, IconButton } from "@mui/material";
import { Store } from "../../store";
import { styled } from "@mui/styles";
import { AppTheme } from "../../app/theme";
import { ChevronLeft } from "@mui/icons-material";
import { SearchContent } from "../search-content";

const DrawerHeader = styled("div")<AppTheme>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const LeftDrawer: React.FC = observer(() => {
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
        <IconButton size="large" onClick={() => Store.ui.toggleDrawer()}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <SearchContent />
    </Drawer>
  );
});
