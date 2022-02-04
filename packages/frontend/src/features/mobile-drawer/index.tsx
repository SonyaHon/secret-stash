import React from "react";
import { observer } from "mobx-react";
import { Box, Dialog, IconButton } from "@mui/material";
import { Store } from "../../store";
import { Close } from "@mui/icons-material";
import { SearchContent } from "../search-content";

export const MobileDrawer: React.FC = observer(() => {
  return (
    <Dialog fullScreen open={Store.ui.drawerOpened}>
      <Box padding="1rem" display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => Store.ui.toggleDrawer()} size="large">
            <Close />
          </IconButton>
        </Box>
        <SearchContent />
      </Box>
    </Dialog>
  );
});
