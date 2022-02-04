import React from "react";
import { observer } from "mobx-react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const Videos: React.FC = observer(() => {
  return (
    <Box>
      <List subheader={<ListSubheader>Search</ListSubheader>}>
        <ListItem>TODO...</ListItem>
      </List>
      <List subheader={<ListSubheader>Add content</ListSubheader>}>
        <Link
          style={{
            color: "black",
            textDecoration: "none",
          }}
          to="/upload/video-file"
        >
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <UploadFile />
              </ListItemIcon>
              <ListItemText primary="Upload" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  );
});
